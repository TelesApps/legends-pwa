import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of, ReplaySubject } from 'rxjs';
import { first, map, take } from 'rxjs/operators';
import { Character, CreateNewCharacter } from '../interfaces/character.interface';
import { Item } from '../interfaces/item.interface';
import { Player } from '../interfaces/player.interface';
import { Stat, StatusEffect } from '../interfaces/status-effect.interface';
import { AirtableDataService } from './airtable-data.service';
import { AuthService } from './auth.service';
import { CalculationsService } from './calculations.service';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  characters$: ReplaySubject<Array<Character>> = new ReplaySubject<Array<Character>>(1);
  selectedCharacters: Array<Character>;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    private airtable: AirtableDataService,
    private calculations: CalculationsService) {
    this.auth.Player$.pipe(first()).subscribe((player) => {
      if (player) {
        if (player.charactersId) {
          console.log('inside player subscribe', player)
          this.afs.collection('characters', ref => ref.where('playerId', '==', player.playerId)).valueChanges(take(1))
            .subscribe((characters: any) => {
              console.log('characters value change collection called');
              this.characters$.next(characters);
              this.characters$.complete();
              this.setSelectedCharacters(player, characters);
            })
        }
      }
    })
  }

  setSelectedCharacters(player: Player, characters: Array<Character>) {
    if (player.selectedCharactersIds) {
      player.selectedCharactersIds.forEach(id => {
        const character: Character = characters.find(c => c.characterId === id);
        if (character) this.selectedCharacters.push(character);
      });
    }
  }

  // Character Creation Service is also calling this to make this calculation, hence the Character input value
  calculateCharacterStats(character: Character) {
    console.log()
    // Set character's calculated stat based on user selection
    // THE MATH FOR EACH CALCULATION IS DEFINED HERE BUT IS BASED ON THE CHARACTER SPREADSHEET (see readme file)
    // First calculate Core Stats
    character.primaryStats.maxHealth = character.primaryStats.maxStamina + (character.primaryStats.core_strength * 10) / 2;
    character.primaryStats.core_ranged = (character.primaryStats.core_accuracy * 0.75) + (character.primaryStats.core_perception * 0.25);
    character.primaryStats.core_melee = (character.primaryStats.core_strength * 0.6) + (character.primaryStats.core_agility * 0.4);
    character.primaryStats.core_defense = (character.primaryStats.core_strength * 0.4) + (character.primaryStats.core_agility * 0.6);
    character.primaryStats.core_movement = (6 + character.primaryStats.core_agility) / 2;
    // Calculate weapon modifiers
    if (this.airtable.allItems && this.airtable.allItems.length > 0) {
      this.calculateEquipmentModifiers(character);
    } else {
      console.error('Items not yet available from Airtable, loading now');
      this.airtable.loadItems();
    }
    // Add weapon modifiers to stats
    this.addModifiersToStats(character, character.equipmentModifier);
    if (this.airtable.skillsTraits && this.airtable.skillsTraits.length > 0) {
      // this.calculateSkillTraitsModifiers(character);
      // // Add Skill modifiers to stats
      // this.addModifiersToStats(character, character.skillTraitsModifiers);
    } else {
      console.error('Skills and Traits not yet available from Airtable, loading now');
      this.airtable.loadSkillsAndTraits();
    }

    // Recalculate Melee Attack, Ranged Attack and Defence which may have been effected by Skills and Traits


    console.log('character in creation : ', character);

  }

  calculateEquipmentModifiers(character: Character) {
    // First Remove all status effects that has the id of each body part;
    character.equipmentModifier = character.equipmentModifier.filter(se => !se.id.includes('head-'));
    character.equipmentModifier = character.equipmentModifier.filter(se => !se.id.includes('main_hand-'));
    character.equipmentModifier = character.equipmentModifier.filter(se => !se.id.includes('off_hand-'));
    character.equipmentModifier = character.equipmentModifier.filter(se => !se.id.includes('chest-'));
    character.equipmentModifier = character.equipmentModifier.filter(se => !se.id.includes('hands-'));
    character.equipmentModifier = character.equipmentModifier.filter(se => !se.id.includes('legs-'));
    character.equipmentModifier = character.equipmentModifier.filter(se => !se.id.includes('feet-'));
    character.equipmentModifier = character.equipmentModifier.filter(se => !se.id.includes('trinket-'));

    let totalArmor: number = 0;

    if (character.equipments.headId) {
      const headItem: Item = this.airtable.getItemById(character.equipments.headId);
      totalArmor += headItem.armor;
      if (headItem.effects && headItem.effects.length > 0) {
        const effects: StatusEffect[] = this.calculations.calculateEffectsFromStrings(headItem.effects, 'head-' + character.equipments.headId);
        character.equipmentModifier = character.equipmentModifier.concat(effects);
      }
    }
    if (character.equipments.mainHandId) {
      const mainHandItem: Item = this.airtable.getItemById(character.equipments.mainHandId);
      let isRanged = false;
      if (mainHandItem.tags && mainHandItem.tags.find(t => t === 'Range' || t === 'range'))
        isRanged = true;
      totalArmor += mainHandItem.armor;
      if (mainHandItem.effects && mainHandItem.effects.length > 0) {
        const effects: StatusEffect[] =
          this.calculations.calculateEffectsFromStrings(mainHandItem.effects, 'main_hand-' + character.equipments.mainHandId, isRanged);
        character.equipmentModifier = character.equipmentModifier.concat(effects);
      }
    }
    if (character.equipments.offHandId) {
      const offHandItem: Item = this.airtable.getItemById(character.equipments.offHandId);
      totalArmor += offHandItem.armor;
      if (offHandItem.effects && offHandItem.effects.length > 0) {
        let isRanged = false;
        if (offHandItem.tags && offHandItem.tags.find(t => t === 'Range' || t === 'range'))
          isRanged = true;
        const effects: StatusEffect[] =
          this.calculations.calculateEffectsFromStrings(offHandItem.effects, 'off_hand-' + character.equipments.offHandId, isRanged);
        // #TODO Add logic here to determine if effects can be full value because of an ability or trait OR add this logic somewhere else
        if (offHandItem.body_property.toLowerCase() === 'weapon') {
          effects.forEach(effect => { effect.value = effect.value / 2; });
        }
        if (this.isTwoHands('', offHandItem)) {
          console.log('item is two handed, offhand stats are not added');
        } else {
          character.equipmentModifier = character.equipmentModifier.concat(effects);
        }
      }
    }
    if (character.equipments.chestId) {
      const chestItem: Item = this.airtable.getItemById(character.equipments.chestId);
      totalArmor += chestItem.armor;
      if (chestItem.effects && chestItem.effects.length > 0) {
        const effects: StatusEffect[] = this.calculations.calculateEffectsFromStrings(chestItem.effects, 'chest-' + character.equipments.chestId);
        character.equipmentModifier = character.equipmentModifier.concat(effects);
      }
    }
    if (character.equipments.handsId) {
      const handsItem: Item = this.airtable.getItemById(character.equipments.handsId);
      totalArmor += handsItem.armor;
      if (handsItem.effects && handsItem.effects.length > 0) {
        const effects: StatusEffect[] = this.calculations.calculateEffectsFromStrings(handsItem.effects, 'hands-' + character.equipments.handsId);
        character.equipmentModifier = character.equipmentModifier.concat(effects);
      }
    }
    if (character.equipments.legsId) {
      const legsItem: Item = this.airtable.getItemById(character.equipments.legsId);
      totalArmor += legsItem.armor;
      if (legsItem.effects && legsItem.effects.length > 0) {
        const effects: StatusEffect[] = this.calculations.calculateEffectsFromStrings(legsItem.effects, 'legs-' + character.equipments.legsId);
        character.equipmentModifier = character.equipmentModifier.concat(effects);
      }
    }
    if (character.equipments.feetId) {
      const feetItem: Item = this.airtable.getItemById(character.equipments.feetId);
      totalArmor += feetItem.armor;
      if (feetItem.effects && feetItem.effects.length > 0) {
        const effects: StatusEffect[] = this.calculations.calculateEffectsFromStrings(feetItem.effects, 'feet-' + character.equipments.feetId);
        character.equipmentModifier = character.equipmentModifier.concat(effects);
      }
    }
    if (character.equipments.trinketsId && character.equipments.trinketsId.length > 0) {
      let index = 0;
      character.equipments.trinketsId.forEach(id => {
        const tricket: Item = this.airtable.getItemById(id);
        totalArmor += tricket.armor;
        if (tricket.effects && tricket.effects.length > 0) {
          const effects: StatusEffect[] = this.calculations.calculateEffectsFromStrings(tricket.effects, 'trinket-' + index + '-' + id);
          character.equipmentModifier = character.equipmentModifier.concat(effects);
        }
        index++;
      });
    }
    console.log('totalArmor: ', totalArmor);
    character.primaryStats.core_maxArmor = totalArmor;
    return character;
  }

  calculateSkillTraitsModifiers(character: Character) {
    character.skillTraitsModifiers = [];
    // #TODO Add additional IF logic for skills and traits based on the conditions column in airtable.
    console.log('calculateSkillTraitsModifiers called')
    character.skillsTraitsId.forEach(id => {
      const skillTrait = this.airtable.getSkillTraitById(id)
      console.log('skillTrait', skillTrait);
      if (skillTrait.conditions) {
        if (this.isConditionsMet(character, skillTrait.conditions)) {
          const effects: StatusEffect[] = this.calculations.calculateEffectsFromStrings(skillTrait.effects, skillTrait.airtable_id);
          character.skillTraitsModifiers = character.skillTraitsModifiers.concat(effects);
        }
      } else {
        const effects: StatusEffect[] = this.calculations.calculateEffectsFromStrings(skillTrait.effects, skillTrait.airtable_id);
        character.skillTraitsModifiers = character.skillTraitsModifiers.concat(effects);
      }
    });

  }

  isConditionsMet(character: Character, conditions: string[]) {
    let isMet = true;
    conditions.forEach(condition => {
      const fields = condition.split('=');
      console.log('fields', fields)
      const ifStatement = fields[0];
      const ifValue = fields[1];
      if (ifStatement === 'equipped-tags') {
        if (this.hasItemTag(character.equipments.mainHandId, ifValue) || this.hasItemTag(character.equipments.offHandId, ifValue)) {
          isMet = true;
        } else {
          isMet = false;
          console.log('Conditions not met. Returning', isMet);
          return isMet;
        }
      }
    });
    console.log('All conditions met Returning', isMet);
    return isMet;
  }

  addModifiersToStats(character: Character, modifiers: Array<StatusEffect>) {
    console.log('addModifiersToStats called', modifiers);
    // 1- Creates a value from the core stat.
    // 2- Adds all of the modifiers to that value.
    // 3- Assigns all of that value to the proper stat, not the core;
    // Health Stamina Power and Stress are ommited from here since they can change per turn
    let maxArmor = character.primaryStats.core_maxArmor;
    let armor = character.primaryStats.armor;
    let dmgResistance = character.primaryStats.dmgResistance;
    // let health = character.primaryStats.health;
    let maxStamina = character.primaryStats.core_maxStamina;
    // let stamina = character.primaryStats.stamina;
    let maxPower = character.primaryStats.core_maxPower;
    //let power = character.primaryStats.power;
    let rangedDmgModifier = character.primaryStats.rangedDmgModifier;
    let meleeDmgModifier = character.primaryStats.meleeDmgModifier;
    let strength = character.primaryStats.core_strength;
    let agility = character.primaryStats.core_agility;
    let accuracy = character.primaryStats.core_accuracy;
    let perception = character.primaryStats.core_perception;
    let mental = character.primaryStats.core_mental;
    let critChance = character.primaryStats.core_critChance;
    let maxStress = character.secondaryStats.max_stress;
    let minStress = character.secondaryStats.min_stress;
    let stressTolerance = character.secondaryStats.core_stressTolerance;
    let stealth = character.secondaryStats.core_stealth;
    let lockPicking = character.secondaryStats.core_lockPicking;
    let quickHands = character.secondaryStats.core_quickHands;
    let persuasion = character.secondaryStats.core_persuasion;
    let intimidation = character.secondaryStats.core_intimidation;
    let engineering = character.secondaryStats.core_engineering;
    let tracking = character.secondaryStats.core_tracking;
    let mining = character.secondaryStats.core_mining;
    let smithing = character.secondaryStats.core_smithing;
    let phiralSmithing = character.secondaryStats.phiralSmithing;
    let herbalism = character.secondaryStats.core_herbalism;
    let alchemy = character.secondaryStats.core_alchemy;
    let cooking = character.secondaryStats.core_cooking;
    let musician = character.secondaryStats.core_musician;
    let artist = character.secondaryStats.core_artist;
    let carryCapacity = character.secondaryStats.core_carryCapacity;

    let maxHealthBonus = 0;
    let rangedAttackBonus = 0;
    let meleeAttackBonus = 0;
    let defenseBonus = 0;
    let movementBonus = 0;
    let maxStressBonus = 0;
    let minStressPenalty = 0;

    modifiers.forEach(modifier => {
      if (modifier.stat === Stat.Accuracy) accuracy += modifier.value;
      if (modifier.stat === Stat.MaxArmor) maxArmor += modifier.value;
      if (modifier.stat === Stat.Armor) armor += modifier.value;
      if (modifier.stat === Stat.DamageResistance) dmgResistance += modifier.value;
      if (modifier.stat === Stat.MaxStamina) maxStamina += modifier.value;
      if (modifier.stat === Stat.MaxPower) maxPower += modifier.value;
      if (modifier.stat === Stat.RangeDmdDelt) rangedDmgModifier += modifier.value;
      if (modifier.stat === Stat.MeleeDmgDelt) meleeDmgModifier += modifier.value;
      if (modifier.stat === Stat.Strength) strength += modifier.value;
      if (modifier.stat === Stat.Agility) agility += modifier.value;
      if (modifier.stat === Stat.Perception) perception += modifier.value;
      if (modifier.stat === Stat.Mental) mental += modifier.value;
      if (modifier.stat === Stat.Crit) critChance += modifier.value;
      if (modifier.stat === Stat.stressTolerance) stressTolerance += modifier.value;
      if (modifier.stat === Stat.stealth) stealth += modifier.value;
      if (modifier.stat === Stat.lockPicking) lockPicking += modifier.value;
      if (modifier.stat === Stat.quickHands) quickHands += modifier.value;
      if (modifier.stat === Stat.persuasion) persuasion += modifier.value;
      if (modifier.stat === Stat.intimidation) intimidation += modifier.value;
      if (modifier.stat === Stat.engineering) engineering += modifier.value;
      if (modifier.stat === Stat.tracking) tracking += modifier.value;
      if (modifier.stat === Stat.mining) mining += modifier.value;
      if (modifier.stat === Stat.smithing) smithing += modifier.value;
      if (modifier.stat === Stat.phiralSmith) phiralSmithing += modifier.value;
      if (modifier.stat === Stat.herbalism) herbalism += modifier.value;
      if (modifier.stat === Stat.alchemy) alchemy += modifier.value;
      if (modifier.stat === Stat.cooking) cooking += modifier.value;
      if (modifier.stat === Stat.musician) musician += modifier.value;
      if (modifier.stat === Stat.artist) artist += modifier.value;
      if (modifier.stat === Stat.carryCapacity) carryCapacity += modifier.value;

      if (modifier.stat === Stat.MaxHealth) maxHealthBonus += modifier.value;
      if (modifier.stat === Stat.RangeAttack) rangedAttackBonus += modifier.value;
      if (modifier.stat === Stat.MeleeAttack) meleeAttackBonus += modifier.value;
      if (modifier.stat === Stat.Defence) defenseBonus += modifier.value;
      if (modifier.stat === Stat.Movement) movementBonus += modifier.value;
      if (modifier.stat === Stat.maxStress) maxStressBonus += modifier.value;
      if (modifier.stat === Stat.minStress) minStressPenalty += modifier.value;
    });
    character.primaryStats.accuracy = accuracy;
    character.primaryStats.maxArmor = maxArmor;
    character.primaryStats.armor = armor;
    character.primaryStats.dmgResistance = dmgResistance;
    character.primaryStats.maxStamina = maxStamina;
    character.primaryStats.maxPower = maxPower;
    character.primaryStats.rangedDmgModifier = rangedDmgModifier;
    character.primaryStats.meleeDmgModifier = meleeDmgModifier;
    character.primaryStats.strength = strength;
    character.primaryStats.agility = agility;
    character.primaryStats.perception = perception;
    character.primaryStats.mental = mental;
    character.primaryStats.critChance = critChance;
    character.secondaryStats.max_stress = maxStress;
    character.secondaryStats.min_stress = minStress;
    character.secondaryStats.stress_tolerance = stressTolerance;
    character.secondaryStats.lockPicking = lockPicking;
    character.secondaryStats.engineering = engineering;
    character.secondaryStats.herbalism = herbalism;
    character.secondaryStats.musician = musician;
    character.secondaryStats.artist = artist;
    //Stats bellow are dependent on certain stats above;
    if (character.secondaryStats.stress > character.secondaryStats.max_stress)
      character.secondaryStats.stress = character.secondaryStats.max_stress;
    if (character.secondaryStats.stress < character.secondaryStats.min_stress)
      character.secondaryStats.stress = character.secondaryStats.min_stress;
    character.primaryStats.core_maxHealth =
      (character.primaryStats.maxStamina + (character.primaryStats.strength * 10) / 2) + maxHealthBonus;
    character.primaryStats.maxHealth = character.primaryStats.core_maxHealth;
    character.primaryStats.rangedAttack =
      (character.primaryStats.accuracy * 0.75) + (character.primaryStats.perception * 0.25) + rangedAttackBonus;
    character.primaryStats.meleeAttack =
      (character.primaryStats.strength * 0.6) + (character.primaryStats.agility * 0.4) + meleeAttackBonus;
    character.primaryStats.defense =
      (character.primaryStats.strength * 0.4) + (character.primaryStats.agility * 0.6) + defenseBonus;
    const mentalWithStrees = character.primaryStats.mental - (character.primaryStats.mental *
      (character.secondaryStats.stress - character.secondaryStats.stress_tolerance));
    if (mentalWithStrees < character.primaryStats.mental)
      character.primaryStats.mental = mentalWithStrees;
    character.primaryStats.movement = ((character.primaryStats.core_movement + character.primaryStats.agility) / 2) + movementBonus;
    character.secondaryStats.stealth = (character.secondaryStats.core_stealth + character.primaryStats.agility) / 2;
    character.secondaryStats.quickHands = (character.secondaryStats.core_quickHands + character.primaryStats.agility) / 2;
    character.secondaryStats.persuasion = (character.secondaryStats.core_persuasion + character.primaryStats.perception) / 2;
    character.secondaryStats.intimidation = (character.secondaryStats.core_intimidation + character.primaryStats.strength) / 2;
    character.secondaryStats.tracking = (character.secondaryStats.core_tracking + character.primaryStats.perception) / 2;
    character.secondaryStats.mining = (character.secondaryStats.core_mining + character.primaryStats.strength) / 2;
    character.secondaryStats.smithing = (character.secondaryStats.core_smithing + character.primaryStats.strength) / 2;
    character.secondaryStats.phiralSmithing = (character.secondaryStats.core_phiralSmithing + character.primaryStats.mental) / 2;
    character.secondaryStats.alchemy = (character.secondaryStats.core_alchemy + character.secondaryStats.herbalism) / 2;
    character.secondaryStats.cooking = (character.secondaryStats.core_cooking + character.secondaryStats.herbalism) / 2;
    character.secondaryStats.carryCapacity = (character.secondaryStats.core_carryCapacity + character.primaryStats.strength) * 10;

    return character;
  }

  isTwoHands(id: string, item?: Item) {
    if (!item) {
      item = this.airtable.getItemById(id);
    }
    if (item && item.tags) {
      return item.tags.find(t => t == '2 Hands' || t == '2 hands' || t == '2Hands' || t == '2hands' || t == '2 Hand' || t == '2 hand');
    } else {
      return '';
    }
  }

  hasItemTag(id: string, tag: string, item?: Item) {
    if (!item) {
      item = this.airtable.getItemById(id);
    }
    if (item && item.tags) {
      return item.tags.find(t => t == tag);
    } else {
      return '';
    }
  }

}

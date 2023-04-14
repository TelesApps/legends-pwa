import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { first, map, take } from 'rxjs/operators';
import { Character, CreateNewCharacter } from '../interfaces/character.interface';
import { Item } from '../interfaces/item.interface';
import { Player } from '../interfaces/player.interface';
import { Stat, StatusEffect } from '../interfaces/status-effect.interface';
import { AirtableDataService } from './airtable-data.service';
import { AuthService } from './auth.service';
import { CalculationsService } from './calculations.service';
import { FirebaseDataService } from './firebase-data.service';
import { DmgType } from '../interfaces/airtable-data.interface';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  selectedCharacters: BehaviorSubject<Array<Character>> = new BehaviorSubject([]);
  viewIndex: number = 0;

  constructor(
    private auth: AuthService,
    private firebaseData: FirebaseDataService,
    private airtable: AirtableDataService,
    private calculations: CalculationsService) {
    this.auth.Player$.pipe(first()).subscribe((player) => {
      if (player) {
        if (player.charactersId) {
          console.log('inside player subscribe', player)
          this.firebaseData.getCharacters(player.selectedCharactersIds).then((characters) => {
            this.selectedCharacters.next(characters);
          });

        }
      }
    })
  }

  getWeaponDamageTypes(character: Character, isMainHand = true): DmgType[] | null {
    let itemId = '';
    if (isMainHand) itemId = character.equipments.mainHandId;
    else itemId = character.equipments.offHandId;
    if (itemId) {
      const item = this.airtable.getItemById(itemId);
      if (item) return item.dmg_type;
      else return null;
    }
    else return null;
  }

  getWeaponDmg(weapon: Item, isRanged: boolean): number {
    const statusEffects: StatusEffect[] = this.calculations.calculateEffectsFromStrings(weapon.effects, null, isRanged);
    const dmgEffect = statusEffects.find(se => se.stat === Stat.MeleeDmgDelt || se.stat === Stat.RangeDmdDelt);
    if (dmgEffect && dmgEffect.value)
      return dmgEffect.value;
    else return 0;
  }

  isTwoHandedWeapon(itemId: string) {
    if (itemId) {
      const weapon = this.airtable.getItemById(itemId);
      if (weapon && weapon.tags) {
        const tag = weapon.tags.find(t => t.toLowerCase() === '2 hands' || t.toLowerCase() === '2hands');
        return tag ? true : false;
      } else return false;
    } else return false;
  }




  // setSelectedCharacters(player: Player, characters: Array<Character>) {
  //   if (player.selectedCharactersIds) {
  //     player.selectedCharactersIds.forEach(id => {
  //       const character: Character = characters.find(c => c.characterId === id);
  //       if (character) this.selectedCharacters.push(character);
  //     });
  //   }
  // }

  // Character Creation Service is also calling this to make this calculation, hence the Character input value
  calculateCharacterStats(character: Character) {
    console.log()
    // Set character's calculated stat based on user selection
    // THE MATH FOR EACH CALCULATION IS DEFINED HERE BUT IS BASED ON THE CHARACTER SPREADSHEET (see readme file)
    // First calculate Core Stats
    character.primaryStats.core_maxHealth = this.calculations.calcMaxHealth(character);
    character.primaryStats.maxHealth = character.primaryStats.core_maxHealth;
    character.primaryStats.core_ranged = this.calculations.calcRangeAttack(character);
    character.primaryStats.core_melee = this.calculations.calcMeleeAttack(character);
    character.primaryStats.core_defense = this.calculations.calcDefense(character);
    character.primaryStats.core_movement = this.calculations.calcMovement(character);
    // Calculate weapon modifiers
    if (this.airtable.$allItems && this.airtable.$allItems.getValue().length > 0) {
      this.calculateEquipmentModifiers(character);
    } else {
      console.error('Items not yet available from Airtable, loading now');
      this.airtable.loadDatabase();
    }
    // Add weapon modifiers to stats
    this.addModifiersToStats(character, character.equipmentModifier);
    if (this.airtable.$skillsTraits && this.airtable.$skillsTraits.getValue().length > 0) {
      this.calculateSkillTraitsModifiers(character);
      // Add Skill modifiers to stats
      this.addModifiersToStats(character, character.skillTraitsModifiers, false, true);
    } else {
      console.error('Skills and Traits not yet available from Airtable, loading now');
      this.airtable.loadDatabase();
    }

    // #TODO add calculation for item weight and penalty if character is overweight

    // Maybe Recalculate Melee Attack, Ranged Attack and Defence which may have been effected by Skills and Traits


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
          console.log('conditions met');
          isMet = true;
        } else {
          return isMet = false;
        }
      }
      if (ifStatement === 'equipped-bodyProp') {
        if (this.hasBodyProp(character.equipments.mainHandId, ifValue)) isMet = true;
        else return isMet = false;
        if (this.hasBodyProp(character.equipments.offHandId, ifValue)) isMet = true;
        else return isMet = false;
        if (this.hasBodyProp(character.equipments.headId, ifValue)) isMet = true;
        else return isMet = false;
        if (this.hasBodyProp(character.equipments.chestId, ifValue)) isMet = true;
        else return isMet = false;
        if (this.hasBodyProp(character.equipments.handsId, ifValue)) isMet = true;
        else return isMet = false;
        if (this.hasBodyProp(character.equipments.legsId, ifValue)) isMet = true;
        else return isMet = false;
        if (this.hasBodyProp(character.equipments.feetId, ifValue)) isMet = true;
        else return isMet = false;
      }
    });
    console.log('isAllConditionsMet', isMet);
    return isMet;
  }

  /// calcFromCurrent means the calculated stats such as MeleeAttack, RangedAttack, MaxHeatlh etc will not be calculated
  /// by the usual algorithm, but will simply be added from the current stat.
  addModifiersToStats(character: Character, modifiers: Array<StatusEffect>, isFromCore = true, calcFromCurrent = false) {
    console.log('addModifiersToStats called', modifiers);
    // 1- Creates a value from the core stat if isFromCore = true, else does not use core.
    // 2- Adds all of the modifiers to that value.
    // 3- Assigns all of that value to the proper stat, not the core;
    let health = character.primaryStats.health;
    let maxStamina = isFromCore ? character.primaryStats.core_maxStamina : character.primaryStats.maxStamina;
    let stamina = character.primaryStats.stamina;
    let maxPower = isFromCore ? character.primaryStats.core_maxPower : character.primaryStats.maxPower;
    let power = character.primaryStats.power;
    let maxArmor = isFromCore ? character.primaryStats.core_maxArmor : character.primaryStats.maxArmor;
    let armor = character.primaryStats.armor;
    let rangedDmgModifier = character.primaryStats.rangedDmgModifier;
    let meleeDmgModifier = character.primaryStats.meleeDmgModifier;
    let strength = isFromCore ? character.primaryStats.core_strength : character.primaryStats.strength;
    let agility = isFromCore ? character.primaryStats.core_agility : character.primaryStats.agility;
    let accuracy = isFromCore ? character.primaryStats.core_accuracy : character.primaryStats.accuracy;
    let perception = isFromCore ? character.primaryStats.core_perception : character.primaryStats.perception;
    let mental = isFromCore ? character.primaryStats.core_mental : character.primaryStats.mental;
    let critChance = isFromCore ? character.primaryStats.core_critChance : character.primaryStats.critChance;
    let dmgResistance = character.primaryStats.dmgResistance;
    let maxStress = character.secondaryStats.max_stress;
    let minStress = character.secondaryStats.min_stress;
    let stressTolerance = isFromCore ? character.secondaryStats.core_stressTolerance : character.secondaryStats.stress_tolerance;
    let stealth = isFromCore ? character.secondaryStats.core_stealth : character.secondaryStats.stealth;
    let lockPicking = isFromCore ? character.secondaryStats.core_lockPicking : character.secondaryStats.lockPicking;
    let quickHands = isFromCore ? character.secondaryStats.core_quickHands : character.secondaryStats.quickHands;
    let persuasion = isFromCore ? character.secondaryStats.core_persuasion : character.secondaryStats.persuasion;
    let intimidation = isFromCore ? character.secondaryStats.core_intimidation : character.secondaryStats.intimidation;
    let engineering = isFromCore ? character.secondaryStats.core_engineering : character.secondaryStats.engineering;
    let tracking = isFromCore ? character.secondaryStats.core_tracking : character.secondaryStats.tracking;
    let mining = isFromCore ? character.secondaryStats.core_mining : character.secondaryStats.mining;
    let smithing = isFromCore ? character.secondaryStats.core_smithing : character.secondaryStats.smithing;
    let phiralSmithing = isFromCore ? character.secondaryStats.core_phiralSmithing : character.secondaryStats.phiralSmithing;
    let herbalism = isFromCore ? character.secondaryStats.core_herbalism : character.secondaryStats.herbalism;
    let alchemy = isFromCore ? character.secondaryStats.core_alchemy : character.secondaryStats.alchemy;
    let cooking = isFromCore ? character.secondaryStats.core_cooking : character.secondaryStats.cooking;
    let musician = isFromCore ? character.secondaryStats.core_musician : character.secondaryStats.musician;
    let artist = isFromCore ? character.secondaryStats.core_artist : character.secondaryStats.artist;
    let carryCapacity = isFromCore ? character.secondaryStats.core_carryCapacity : character.secondaryStats.carryCapacity;

    let maxHealth = calcFromCurrent ? character.primaryStats.maxHealth : this.calculations.calcMaxHealth(character, isFromCore);
    let rangedAttack = calcFromCurrent ? character.primaryStats.rangedAttack : this.calculations.calcRangeAttack(character, isFromCore);
    let meleeAttack = calcFromCurrent ? character.primaryStats.meleeAttack : this.calculations.calcMeleeAttack(character, isFromCore);
    console.log('meleeAttack', meleeAttack)
    let defense = calcFromCurrent ? character.primaryStats.defense : this.calculations.calcDefense(character, isFromCore);
    let movement = calcFromCurrent ? character.primaryStats.movement : this.calculations.calcMovement(character, isFromCore);

    modifiers.forEach(modifier => {
      if (modifier.stat === Stat.Accuracy) {
        if (modifier.application === 'multiple_of') accuracy = accuracy + (accuracy * modifier.value);
        else accuracy += modifier.value;
      }
      if (modifier.stat === Stat.MaxArmor) {
        if (modifier.application === 'multiple_of') maxArmor = maxArmor + (maxArmor * modifier.value);
        else maxArmor += modifier.value;
      }
      if (modifier.stat === Stat.Armor) {
        if (modifier.application === 'multiple_of') armor = armor + (armor * modifier.value);
        else armor += modifier.value;
      }
      if (modifier.stat === Stat.DamageResistance) {
        if (modifier.application === 'multiple_of') dmgResistance = dmgResistance + (dmgResistance * modifier.value);
        else dmgResistance += modifier.value;
      }
      if (modifier.stat === Stat.MaxStamina) {
        if (modifier.application === 'multiple_of') maxStamina = maxStamina + (maxStamina * modifier.value);
        else maxStamina += modifier.value;
      }
      if (modifier.stat === Stat.MaxPower) {
        if (modifier.application === 'multiple_of') maxPower = maxPower + (maxPower * modifier.value);
        else maxPower += modifier.value;
      }
      if (modifier.stat === Stat.RangeDmdDelt) {
        if (modifier.application === 'multiple_of') rangedDmgModifier = rangedDmgModifier + (rangedDmgModifier * modifier.value);
        else rangedDmgModifier += modifier.value;
      }
      if (modifier.stat === Stat.MeleeDmgDelt) {
        if (modifier.application === 'multiple_of') meleeDmgModifier = meleeDmgModifier + (meleeDmgModifier * modifier.value);
        else meleeDmgModifier += modifier.value;
      }
      if (modifier.stat === Stat.Strength) {
        if (modifier.application === 'multiple_of') strength = strength + (strength * modifier.value);
        else strength += modifier.value;
      }
      if (modifier.stat === Stat.Agility) {
        if (modifier.application === 'multiple_of') agility = agility + (agility * modifier.value);
        else agility += modifier.value;
      }
      if (modifier.stat === Stat.Perception) {
        if (modifier.application === 'multiple_of') perception = perception + (perception * modifier.value);
        else perception += modifier.value;
      }
      if (modifier.stat === Stat.Mental) {
        if (modifier.application === 'multiple_of') mental = mental + (mental * modifier.value);
        else mental += modifier.value;
      }
      if (modifier.stat === Stat.Crit) {
        if (modifier.application === 'multiple_of') critChance += modifier.value;
        else critChance = critChance + (critChance * modifier.value);
      }
      if (modifier.stat === Stat.stressTolerance) {
        if (modifier.application === 'multiple_of') stressTolerance += modifier.value;
        else stressTolerance = stressTolerance + (stressTolerance * modifier.value);
      }
      if (modifier.stat === Stat.stealth) {
        if (modifier.application === 'multiple_of') stealth = stealth + (stealth * modifier.value);
        else stealth += modifier.value;
      }
      if (modifier.stat === Stat.lockPicking) {
        if (modifier.application === 'multiple_of') lockPicking = lockPicking + (lockPicking * modifier.value);
        else lockPicking += modifier.value;
      }
      if (modifier.stat === Stat.quickHands) {
        if (modifier.application === 'multiple_of') quickHands = quickHands + (quickHands * modifier.value);
        else quickHands += modifier.value;
      }
      if (modifier.stat === Stat.persuasion) {
        if (modifier.application === 'multiple_of') persuasion = persuasion + (persuasion * modifier.value);
        else persuasion += modifier.value;
      }
      if (modifier.stat === Stat.intimidation) {
        if (modifier.application === 'multiple_of') intimidation = intimidation + (intimidation * modifier.value);
        else intimidation += modifier.value;
      }
      if (modifier.stat === Stat.engineering) {
        if (modifier.application === 'multiple_of') engineering = engineering + (engineering * modifier.value);
        else engineering += modifier.value;
      }
      if (modifier.stat === Stat.tracking) {
        if (modifier.application === 'multiple_of') tracking = tracking + (tracking * modifier.value);
        else tracking += modifier.value;
      }
      if (modifier.stat === Stat.mining) {
        if (modifier.application === 'multiple_of') mining = mining + (mining * modifier.value);
        else mining += modifier.value;
      }
      if (modifier.stat === Stat.smithing) {
        if (modifier.application === 'multiple_of') smithing = smithing + (smithing * modifier.value);
        else smithing += modifier.value;
      }
      if (modifier.stat === Stat.phiralSmith) {
        if (modifier.application === 'multiple_of') phiralSmithing = phiralSmithing + (phiralSmithing * modifier.value);
        else phiralSmithing += modifier.value;
      }
      if (modifier.stat === Stat.herbalism) {
        if (modifier.application === 'multiple_of') herbalism = herbalism + (herbalism * modifier.value);
        else herbalism += modifier.value;
      }
      if (modifier.stat === Stat.alchemy) {
        if (modifier.application === 'multiple_of') alchemy = alchemy + (alchemy * modifier.value);
        else alchemy += modifier.value;
      }
      if (modifier.stat === Stat.cooking) {
        if (modifier.application === 'multiple_of') cooking = cooking + (cooking * modifier.value);
        else cooking += modifier.value;
      }
      if (modifier.stat === Stat.musician) {
        if (modifier.application === 'multiple_of') musician = musician + (musician * modifier.value);
        else musician += modifier.value;
      }
      if (modifier.stat === Stat.artist) {
        if (modifier.application === 'multiple_of') artist = artist + (artist * modifier.value);
        else artist += modifier.value;
      }
      if (modifier.stat === Stat.carryCapacity) {
        if (modifier.application === 'multiple_of') carryCapacity = carryCapacity + (carryCapacity * modifier.value);
        else carryCapacity += modifier.value;
      }

      if (modifier.stat === Stat.MaxHealth) {
        if (modifier.application === 'multiple_of') maxHealth = maxHealth + (maxHealth * modifier.value);
        else maxHealth += modifier.value;
      }
      if (modifier.stat === Stat.RangeAttack) {
        if (modifier.application === 'multiple_of') rangedAttack = rangedAttack + (rangedAttack * modifier.value);
        else rangedAttack += modifier.value;
      }
      if (modifier.stat === Stat.MeleeAttack) {
        if (modifier.application === 'multiple_of') meleeAttack = meleeAttack + (meleeAttack * modifier.value);
        else meleeAttack += modifier.value;
      }
      if (modifier.stat === Stat.Defence) {
        if (modifier.application === 'multiple_of') defense = defense + (defense * modifier.value);
        else defense += modifier.value;
      }
      if (modifier.stat === Stat.Movement) {
        if (modifier.application === 'multiple_of') movement = movement + (movement * modifier.value);
        else movement += modifier.value;
      }
      if (modifier.stat === Stat.maxStress) {
        if (modifier.application === 'multiple_of') maxStress += modifier.value;
        else maxStress = maxStress + (maxStress * modifier.value);
      }
      if (modifier.stat === Stat.minStress) {
        if (modifier.application === 'multiple_of') minStress += modifier.value;
        else minStress = minStress + (minStress * modifier.value);
      }
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

    if (character.secondaryStats.stress > character.secondaryStats.max_stress)
      character.secondaryStats.stress = character.secondaryStats.max_stress;
    if (character.secondaryStats.stress < character.secondaryStats.min_stress)
      character.secondaryStats.stress = character.secondaryStats.min_stress;

    character.primaryStats.maxHealth = maxHealth;
    character.primaryStats.rangedAttack = rangedAttack;
    character.primaryStats.meleeAttack = meleeAttack;
    character.primaryStats.defense = defense;
    character.primaryStats.movement = movement;

    const mentalWithStrees = character.primaryStats.mental - (character.primaryStats.mental *
      (character.secondaryStats.stress - character.secondaryStats.stress_tolerance));
    if (mentalWithStrees < character.primaryStats.mental)
      character.primaryStats.mental = mentalWithStrees;

    // #TODO Move all of these bellow to the Calculation service
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
      console.log('checking item.tags', item.tags);
      console.log('looking for tag', tag);
      return item.tags.find(t => t.toLowerCase() == tag.toLowerCase());
    } else {
      return '';
    }
  }

  hasBodyProp(id: string, prop: string, item?: Item) {
    if (!item) {
      item = this.airtable.getItemById(id);
    }
    if (item && item.body_property) {
      return item.body_property == prop;
    } else {
      return false;
    }
  }

}

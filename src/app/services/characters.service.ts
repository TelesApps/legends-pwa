import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of, ReplaySubject } from 'rxjs';
import { first, map, take } from 'rxjs/operators';
import { Character } from '../interfaces/character.interface';
import { Item } from '../interfaces/item.interface';
import { Player } from '../interfaces/player.interface';
import { StatusEffect } from '../interfaces/status-effect.interface';
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
    // Set character's calculated stat based on user selection
    // THE MATH FOR EACH CALCULATION IS DEFINED HERE BUT IS BASED ON THE CHARACTER SPREADSHEET 
      character.primaryStats.maxHealth = character.primaryStats.maxStamina + (character.primaryStats.core_strength * 10) / 2;

      if(this.airtable.allItems && this.airtable.allItems.length > 0) {
        this.calculateEquipmentModifiers(character);
      }
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
      totalArmor += mainHandItem.armor;
      if (mainHandItem.effects && mainHandItem.effects.length > 0) {
        const effects: StatusEffect[] =
          this.calculations.calculateEffectsFromStrings(mainHandItem.effects, 'main_hand-' + character.equipments.mainHandId);
        character.equipmentModifier = character.equipmentModifier.concat(effects);
      }
    }
    if (character.equipments.offHandId) {
      const offHandItem: Item = this.airtable.getItemById(character.equipments.offHandId);
      totalArmor += offHandItem.armor;
      if (offHandItem.effects && offHandItem.effects.length > 0) {
        const effects: StatusEffect[] =
          this.calculations.calculateEffectsFromStrings(offHandItem.effects, 'off_hand-' + character.equipments.offHandId);
        // #TODO Add logic here to determine if effects can be full value because of an ability or trait
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
    character.primaryStats.maxArmor = totalArmor;

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
}

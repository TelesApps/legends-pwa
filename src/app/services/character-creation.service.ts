import { Injectable } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
import { Character, CreateNewCharacter } from '../interfaces/character.interface';
import { Item, ItemSelection } from '../interfaces/item.interface';
import { AirtableDataService } from './airtable-data.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterCreationService {

  statsPoints = 12;
  goldPoints = 280;
  abilityPoints = 30;
  skillsPoints = 30;
  itemSelection: ItemSelection
  characterSubj: ReplaySubject<Character> = new ReplaySubject<Character>(1);
  statSubscription: Subscription
  constructor(private airtable: AirtableDataService) {
    this.calculateCharacterStats();
    this.initItemSelection();
    const character = CreateNewCharacter();
    this.characterSubj.next(character);
  }

  initItemSelection() {
    this.itemSelection = {
      currentlyEquipped: undefined,
      bodyProperty: '',
      hand: undefined,
      isStartingItem: true,
      onSelectedItem: undefined,
    }
  }

  public updateCreationCharacter(character: Character) {
    this.characterSubj.next(character);
  }

  private calculateCharacterStats() {
    // Set character's calculated stat based on user selection
    this.statSubscription = this.characterSubj.subscribe((character) => {
      character.primaryStats.maxHealth = character.primaryStats.maxStamina + (character.primaryStats.core_strength * 10) / 2;
      if(this.airtable.allItems && this.airtable.allItems.length > 0) {
        this.calculateEquipmentModifiers(character);
      }
    })
  }

  calculateEquipmentModifiers(character: Character) {
    const headItem: Item = this.airtable.getItemById(character.equipments.headId);
    const mainHandItem: Item = this.airtable.getItemById(character.equipments.mainHandId);
    const offHandItem: Item = this.airtable.getItemById(character.equipments.offHandId);
    const chestItem: Item = this.airtable.getItemById(character.equipments.chestId);
    const handsItem: Item = this.airtable.getItemById(character.equipments.handsId);
    const legsItem: Item = this.airtable.getItemById(character.equipments.legsId);
    const feetItem: Item = this.airtable.getItemById(character.equipments.feetId);
  }

  saveNewCharacterToCloud() {
    // Perform logic and function to save character to Firestore
    // Unsubscribe and delete data.
    this.statSubscription.unsubscribe();
  }

  closeCreation() {
    this.statSubscription.unsubscribe();
  }

}

import { Injectable } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
import { Character, CreateNewCharacter } from '../interfaces/character.interface';
import { Item, ItemSelection } from '../interfaces/item.interface';
import { AirtableDataService } from './airtable-data.service';
import { CharactersService } from './characters.service';

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
  constructor(private airtable: AirtableDataService, private characterSer: CharactersService) {
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
      this.characterSer.calculateCharacterStats(character);
      console.log('character in creation : ', character);
    })
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

import { Injectable } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
import { Character, CreateNewCharacter } from '../interfaces/character.interface';

@Injectable({
  providedIn: 'root'
})
export class CharacterCreationService {

  statsPoints = 12;
  goldPoints = 280;
  abilityPoints = 30;
  skillsPoints = 30;
  characterSubj: ReplaySubject<Character> = new ReplaySubject<Character>(1);
  statSubscription: Subscription
  constructor() {
    const character = CreateNewCharacter();
    this.characterSubj.next(character);
    this.setCharacterStats();
  }

  setCharacterStats() {
    // Set character's calculated stat based on user selection
    this.statSubscription = this.characterSubj.subscribe((character) => {
      character.primaryStats.maxHealth = character.primaryStats.maxStamina + (character.primaryStats.core_strength * 10) / 2;
    })
  }

  saveNewCharacterToCloud() {
    // Perform logic and function to save character to Firestore
    // Unsubscribe and delete data.
    this.characterSubj.unsubscribe();
    this.statSubscription.unsubscribe();
  }

}

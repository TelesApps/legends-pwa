import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
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
  constructor() {
    const character = CreateNewCharacter();
    this.characterSubj.next(character);
  }

  saveNewCharacterToCloud() {
    // Perform logic and function to save character to Firestore
    // Unsubscribe and delete data.
    this.characterSubj.unsubscribe();
  }

}

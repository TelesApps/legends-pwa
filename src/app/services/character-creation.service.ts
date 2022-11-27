import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { ReplaySubject, Subscription } from 'rxjs';
import { Ability } from '../interfaces/ability.interface';
import { Character, CreateNewCharacter } from '../interfaces/character.interface';
import { Item, ItemSelection } from '../interfaces/item.interface';
import { Player } from '../interfaces/player.interface';
import { SkillTraits } from '../interfaces/skills-traits.interface';
import { AirtableDataService } from './airtable-data.service';
import { AuthService } from './auth.service';
import { CharactersService } from './characters.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterCreationService {

  statsPoints = 12;
  goldPoints = 280;
  abilityPoints = 30;
  skillsPoints = 200;
  // AbilitiesTitle is used for the Prerequisite system
  characterSelectedAbilities: Array<Ability> = [];
  // characterSelectedSkills and Trais is used to seperate the two and do a ngForLoop to display their respective panles;
  characterSelectedSkills: Array<SkillTraits> = [];
  characterSelectedTraits: Array<SkillTraits> = [];

  itemSelection: ItemSelection;
  abilitySelection: Ability;
  skillTraitsSelection: SkillTraits;
  characterSubj: ReplaySubject<Character> = new ReplaySubject<Character>(1);
  statSubscription: Subscription;
  constructor(private characterSer: CharactersService, private auth: AuthService, private afs: AngularFirestore) {
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

  saveNewCharacterToCloud(player: Player, character: Character) {
    this.statSubscription.unsubscribe();
    let characterId = player.userName.replace(/ /g,"_") + '_' + character.characterName.replace(/ /g,"_") + '_' + player.charactersId.length;
    characterId = characterId.toLowerCase();
    character.characterId = characterId;
    character.playerId = player.playerId;
    player.charactersId.push(characterId);
    console.log('saving player', player)
    console.log('saving character', character)
    this.auth.updateUserData(player);
    const docRef: AngularFirestoreDocument<any> = this.afs.doc(`characters/${characterId}`);
    return docRef.set(character, { merge: true });
  }

  closeCreation() {
    this.statSubscription.unsubscribe();
  }

}

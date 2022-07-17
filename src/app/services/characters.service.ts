import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of, ReplaySubject } from 'rxjs';
import { first, map, take } from 'rxjs/operators';
import { Character } from '../interfaces/character.interface';
import { Item } from '../interfaces/item.interface';
import { Player } from '../interfaces/player.interface';
import { AirtableDataService } from './airtable-data.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  characters$: ReplaySubject<Array<Character>> = new ReplaySubject<Array<Character>>(1);
  selectedCharacters: Array<Character>;

  constructor(private auth: AuthService, private afs: AngularFirestore, private airtable: AirtableDataService) {
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

  calculateEquipmentModifiers(character: Character) {
    if(character.equipments.headId) {
      const headItem: Item = this.airtable.getItemById(character.equipments.headId);

    }
    if(character.equipments.mainHandId) {
      const mainHandItem: Item = this.airtable.getItemById(character.equipments.mainHandId);

    }
    if(character.equipments.offHandId) {
      const offHandItem: Item = this.airtable.getItemById(character.equipments.offHandId);
    }
    if(character.equipments.chestId) {
      const chestItem: Item = this.airtable.getItemById(character.equipments.chestId);

    }
    if(character.equipments.handsId) {
      const handsItem: Item = this.airtable.getItemById(character.equipments.handsId);

    }
    if(character.equipments.legsId) {
      const legsItem: Item = this.airtable.getItemById(character.equipments.legsId);

    }
    if(character.equipments.feetId) {
      const feetItem: Item = this.airtable.getItemById(character.equipments.feetId);

    }
  }
}

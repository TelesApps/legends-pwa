import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of, ReplaySubject } from 'rxjs';
import { first, map, take } from 'rxjs/operators';
import { Character } from '../interfaces/character.interface';
import { Player } from '../interfaces/player.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  characters$: ReplaySubject<Array<Character>> = new ReplaySubject<Array<Character>>(1);
  selectedCharacters: Array<Character>;

  constructor(private auth: AuthService, private afs: AngularFirestore) {
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
}

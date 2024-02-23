import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Character } from '../interfaces/character.interface';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDataService {

  $allPortraits: BehaviorSubject<Array<string>> = new BehaviorSubject([]);
  // $allCharacters: BehaviorSubject<Array<Character>> = new BehaviorSubject([]);
  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) { }

  loadAllPortraits() {
    if (this.$allPortraits.getValue().length < 1) {
      this.storage.ref('character-portraits').listAll().subscribe((res) => {
        const urls: Array<string> = [];
        res.items.forEach(imageRef => {
          imageRef.getDownloadURL().then(url => urls.push(url))
        });
        this.$allPortraits.next(urls);
      })
    }
  }

  /// Makes a single call to get an array of characters based on an array of string.
  getCharacters(ids: string[]) {
    if(ids === null || ids.length === 0) return null;
    return this.afs.collection('characters', ref => ref.where("characterId", "in", ids)).get().pipe(map((querysnapshot) => {
      const characters: Array<Character> = [];
      querysnapshot.forEach(doc => {
        characters.push(<Character>doc.data());
      });
      return characters;
    })).toPromise()
  }

  getAllCharacters(playerId: string) {
    return this.afs.collection('characters', ref => ref.where("playerId", "==", playerId)).valueChanges();
  }

  //Update Character In Cloud
  updateCharacter(character: Character) {
    const docRef = this.afs.collection('characters').doc(character.characterId)
    return docRef.set(character, { merge: true });
  }

  deleteCharacter(id: string) {
    return this.afs.collection('characters').doc(id).delete();
  }

  getCharacterPortrait(characterId): Observable<string> {
    // update this to return the portrait url as a promise
    
    return this.afs.collection('characters').doc(characterId).get().pipe(map((doc: any) => {
      return doc.data().portraitUrl;
    }))
  }


  // DO NOT DELETE, REFERENCE TO GETTING COLLECTION USING THE GET METHOD
  // getAllCharacters() {
  //   return this.afs.collection('characters').get().pipe(map((querysnapshot) => {
  //     const characters: Array<Character> = [];
  //     querysnapshot.forEach(doc => {
  //       console.log('doc.data', doc.data());
  //       characters.push(<Character>doc.data());
  //     });
  //     console.log('characters', characters);
  //     return characters
  //   }))
  // }
}


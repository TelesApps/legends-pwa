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

  getAllCharacters(playerId: string) {
    return this.afs.collection('characters', ref => ref.where("playerId", "==", playerId)).valueChanges();
  }

  deleteCharacter(id: string) {
    return this.afs.collection('characters').doc(id).delete();
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


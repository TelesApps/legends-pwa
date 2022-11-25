import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDataService {

  $allPortraits: BehaviorSubject<Array<string>> = new BehaviorSubject([]);
  constructor(private http: HttpClient, private storage: AngularFireStorage) { }

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
}

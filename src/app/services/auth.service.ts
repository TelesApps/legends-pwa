import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { Player } from '../interfaces/player.interface';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public Player$: Observable<Player>;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.Player$ = this.afAuth.authState.pipe(switchMap((user => {
      if (user) {
        return this.afs.doc<Player>(`players/${user.uid}`).valueChanges();
      } else {
        return of(null);
      }
    })))
  }
}

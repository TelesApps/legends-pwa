import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, firstValueFrom, of } from 'rxjs';
import { CreateUser, Player } from '../interfaces/player.interface';
import { first, map, switchMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { actionCodeSettings } from 'src/environments/environment';
import * as firebase from 'firebase/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public Player$: Observable<Player>;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this.Player$ = this.afAuth.authState.pipe(switchMap((user => {
      if (user) {
        return this.afs.doc<Player>(`players/${user.uid}`).valueChanges();
      } else {
        return of(null);
      }
    })))
  }

  getPlayer() {
    return firstValueFrom(this.Player$);
  }
  

  // Register New User via email and password signup
  registerNewUser(email: string, password: string, userName: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password).catch(
      (error) => {
        console.log(error);
        return Promise.reject(error);
      }
    ).then(async (response) => {
      const authUser = await this.afAuth.currentUser;
      let user = CreateUser(
        authUser.uid, authUser.displayName, authUser.email, authUser.emailVerified, authUser.photoURL);
      user.userName = userName;
      this.updateUserData(user);
      return authUser.sendEmailVerification(actionCodeSettings);
    }
    )
  }

  async resendVerificationEmail(email: string) {
    let user = await this.afAuth.currentUser;
    return await user.updateEmail(email).then(async () => {
      return await user.sendEmailVerification(actionCodeSettings)
    }).catch((error) => {
      return Promise.reject(error);
    })
  }

  // Sign in with email and password
  signinWithEmailAndPassword(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Sign in with Google
  signInWithGoogle() {
    try {
      console.log('login with google called');
      const provider = new firebase.GoogleAuthProvider();
      return this.oAuthLogin(provider);
    } catch (error) {
      console.error('Error Loging in with google');
      console.error(error);
    }
  }

  private async oAuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider)
      .then((credential) => {
        this.Player$.subscribe((user) => {
          // Create New User if User is Null
          if (!user) {
            console.log('Creating a new User Profile');
            const cred = credential.user;
            const userData: Player = CreateUser(cred.uid, cred.displayName, cred.email, cred.emailVerified, cred.photoURL);
            this.router.navigate(['/']);
            return this.updateUserData(userData);
          } else {
            if (user.photoUrl === '' && credential.user.photoURL !== '') {
              user.photoUrl = credential.user.photoURL;
              this.updateUserData(user);
            }
            this.router.navigate(['/']);
            return this.afs.doc(`users/${credential.user.uid}`);
          }
        });
      }).catch((err) => {console.error(err)});
  }

  // Update User information in Firebase Database
  updateUserData(userData: Player) {
    console.log('updating user data with the following data', userData);
    const docRef: AngularFirestoreDocument<any> = this.afs.doc(`players/${userData.playerId}`);
    return docRef.set(userData, { merge: true });
  }

  logOut() {
    this.afAuth.signOut().then(() => {
      console.log('User has been logged out');
      this.router.navigate(['/login']);
    });
  }
}

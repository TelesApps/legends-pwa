import { Injectable } from '@angular/core';
import { GameRoom } from '../interfaces/game-room.interface';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class GameRoomsService {

  constructor(private afs: AngularFirestore) { }

  createGameRoom(gameRoom: GameRoom) {
    // Create the game room document
    const docRef: AngularFirestoreDocument<any> = this.afs.doc(`game_rooms/${gameRoom.gameRoomId}`);
    return docRef.set(gameRoom, { merge: true });
  }

  // Get every character in game room from firebase, and subscribe to their value changes
  getAllGameRoomCharacters(gameRoomId: string) {
    // Get all charracters that contains the gameRoomId in their Array of gameRoomIds
    return this.afs.collection('characters', ref => ref.where("gameRoomIds", "array-contains", gameRoomId)).valueChanges();
  }
}

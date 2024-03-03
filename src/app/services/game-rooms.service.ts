import { Injectable } from '@angular/core';
import { GameRoom } from '../interfaces/game-room.interface';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Character } from '../interfaces/character.interface';
import { Player } from '../interfaces/player.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GameRoomsService {

  constructor(private afs: AngularFirestore, private auth: AuthService) { }

  createGameRoom(gameRoom: GameRoom) {
    // Create the game room document
    const docRef: AngularFirestoreDocument<any> = this.afs.doc(`game_rooms/${gameRoom.gameRoomId}`);
    return docRef.set(gameRoom, { merge: true });
  }

  updateGameRoom(gameRoom: GameRoom) {
    const docRef: AngularFirestoreDocument<any> = this.afs.doc(`game_rooms/${gameRoom.gameRoomId}`);
    return docRef.set(gameRoom, { merge: true });
  }

  getAllPublicGameRooms() {
    return this.afs.collection('game_rooms', ref => ref.where("isGamePublic", "==", true)).valueChanges();
  }

  // Get every character in game room from firebase, and subscribe to their value changes
  getAllGameRoomCharacters(gameRoomId: string) {
    // Get all charracters that contains the gameRoomId in their Array of gameRoomIds
    return this.afs.collection('characters', ref => ref.where("gameRoomIds", "array-contains", gameRoomId)).valueChanges();
  }

  getAllGameRoomsWithPlayerId(playerId: string) {
    return this.afs.collection('game_rooms', ref => ref.where("playersId", "array-contains", playerId)).valueChanges();
  }

  leaveGameRoom(player: Player, gameRoom: GameRoom) {
    // Remove gameRoomId from each character from this player that is in the room
    // first get all characters from this player that are in the game room
    const charactersId = gameRoom.charactersId.filter((characterId: string) => player.charactersId.includes(characterId));
    console.log('characters in room', charactersId);
    // remove the gameRoomId from each character
    charactersId.forEach(characterId => {
      console.log('characters', characterId);
      this.afs.doc(`characters/${characterId}`).get().subscribe((characterDoc: any) => {
        const character: Character = characterDoc.data();
        if (character) {
          character.gameRoomIds = character.gameRoomIds.filter((gameRoomId: string) => gameRoomId !== gameRoom.gameRoomId);
          this.afs.doc(`characters/${characterId}`).set(character, { merge: true });
        }
      });
      // remove each character from the gameroom
      gameRoom.charactersId = gameRoom.charactersId.filter((id: string) => id !== characterId);
    });
    // remove the gameRoomId from the player
    player.gameRooms = player.gameRooms.filter((gameRoomId: string) => gameRoomId !== gameRoom.gameRoomId);
    if(player.currentGameRoom === gameRoom.gameRoomId) {
      player.currentGameRoom = '';
    }
    // update the player document
    this.auth.updateUserData(player);
    // remove the playerID from the gameRoom
    gameRoom.playersId = gameRoom.playersId.filter((id: string) => id !== player.playerId);
    // update the gameRoom document
    return this.updateGameRoom(gameRoom);
  }

  deleteGameRoom(gameRoom: GameRoom) {
    // Remove the gameRoomId from every character that is in the game room
    gameRoom.charactersId.forEach(characterId => {
      this.afs.doc(`characters/${characterId}`).get().subscribe((characterDoc: any) => {
        const character: Character = characterDoc.data();
        if (character) {
          character.gameRoomIds = character.gameRoomIds.filter((gameRoomId: string) => gameRoomId !== gameRoom.gameRoomId);
          this.afs.doc(`characters/${characterId}`).set(character, { merge: true });
        }
      });
    });
    // remove game room from each player in that game room
    gameRoom.playersId.forEach(playerId => {
      this.afs.doc(`players/${playerId}`).get().subscribe((playerDoc: any) => {
        const player = playerDoc.data();
        if (player) {
          player.gameRoomIds = player.gameRoomIds.filter((gameRoomId: string) => gameRoomId !== gameRoom.gameRoomId);
          if(player.currentGameRoom === gameRoom.gameRoomId) {
            player.currentGameRoom = '';
          }
          this.auth.updateUserData(player);
        }
      });
    });
    // remove the game room document
    return this.afs.doc(`game_rooms/${gameRoom.gameRoomId}`).delete();
  }
}

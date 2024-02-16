import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Player } from '../interfaces/player.interface';
import { AuthService } from '../services/auth.service';
import { CharactersService } from '../services/characters.service';
import { FirebaseDataService } from '../services/firebase-data.service';
import { ModalController } from '@ionic/angular';
import { CreateRoomComponent } from '../modals/create-room/create-room.component';
import { CreateGameRoomObject, GameRoom } from '../interfaces/game-room.interface';
import { GameRoomsService } from '../services/game-rooms.service';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-main-lobby',
  templateUrl: './main-lobby.page.html',
  styleUrls: ['./main-lobby.page.scss'],
})
export class MainLobbyPage implements OnInit, OnDestroy {

  isLoading = true;
  avatarText: string = ''
  photoUrl: string = '';
  isCreateRoomModalOpen: boolean = false;
  createRoomName: string = '';
  gamesSubs$: Subscription;
  gameRooms: GameRoom[] = [];
  characterPortraits: Map<string, string> = new Map<string, string>();

  constructor(
    public auth: AuthService,
    public charactersService: CharactersService,
    private firebase: FirebaseDataService,
    private gameRoomService: GameRoomsService,
    private modalCtrl: ModalController) {
    this.auth.Player$.pipe(takeUntilDestroyed()).subscribe((player) => {
      if (player) {
        this.gamesSubs$ = this.gameRoomService.getAllGameRoomsWithPlayerId(player.playerId).subscribe((gameRooms: GameRoom[]) => {
          console.log('gameRooms', gameRooms);
          this.gameRooms = gameRooms;
          // get all portraits for all characters in these game rooms
          this.gameRooms.forEach(gameroom => {
            this.firebase.getCharacters(gameroom.charactersId).then((characters) => {
              characters.forEach(character => {
                this.characterPortraits.set(character.characterId, character.portraitUrl);
              });
            });
          });
        });
      }
    });
  }

  ngOnInit() {
    // Get all ame rooms with the player ID from firebase use pipe to unsubscribe once component is destroyed.
    this.firebase.getCharacterPortrait('claudio_teles_turock_1684674587237').pipe(take(1)).subscribe((portraitUrl) => {
      console.log('portraitUrl', portraitUrl);
    });
  }

  loadCharacterPortraits(ids: string[]) {
    // const characters = this.firebase.getCharacters(ids);
    // console.log('characters', characters);
    return true;
  }

  setProfileInfo(player: Player) {
    if (!player) {
    } else {
      this.avatarText = player.userName[0];
      this.avatarText = player.userName.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '')
      this.photoUrl = player.photoUrl;
    }
    this.isLoading = false;
    return player;
  }

  async onOpenCreateRoomModal(player: Player) {
    const modal = await this.modalCtrl.create({
      component: CreateRoomComponent,
      componentProps: {
        player
      }
    });
    modal.present();

    const { data } = await modal.onWillDismiss();

    if (player && data && data.status === 'confirm') {
      let gameRoom = CreateGameRoomObject();
      const timestamp = new Date();
      gameRoom.gameRoomId = player.userName.toLocaleLowerCase().replace(/ /g, "_") + '_' +
        data.roomName.toLocaleLowerCase().replace(/ /g, "_") + '_' + timestamp.valueOf();
      gameRoom.gameRoomName = data.roomName;
      gameRoom.isGamePublic = data.publicGame;
      gameRoom.playersAlloted = data.playerLimit;
      gameRoom.charactersPerPlayerAlloted = data.charactersPerPlayer;
      gameRoom.totalCharactersAlloted = data.totalCharacters;
      gameRoom.gameMasterId = player.playerId;
      gameRoom.playersId.push(player.playerId);
      gameRoom.charactersId = gameRoom.charactersId.concat(player.selectedCharactersIds);
      // Add game room ID to the player then save it to cloud.
      player.gameRooms.push(gameRoom.gameRoomId);
      this.auth.updateUserData(player);
      // Add game room ID to each character in game room then save it to cloud.
      this.charactersService.selectedCharacters.getValue().forEach((character) => {
        if (!character.gameRoomIds) {
          character['gameRoomIds'] = [];
        }
        character.gameRoomIds.push(gameRoom.gameRoomId);
        this.firebase.updateCharacter(character);
      });
      console.log('save this to firebase, ', gameRoom);
      this.gameRoomService.createGameRoom(gameRoom);
    }
  }

  ngOnDestroy() {
    if (this.gamesSubs$)
      this.gamesSubs$.unsubscribe();
  }

}

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
import { ConfirmSelectionComponent } from '../modals/confirm-selection/confirm-selection.component';

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
  playerGameRooms: GameRoom[] = [];
  currentGame: GameRoom;
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
          this.setGameRooms(player, gameRooms);
          // get all portraits for all characters in these game rooms
          this.playerGameRooms.forEach(gameroom => {
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

  setGameRooms(player: Player, gameRooms: GameRoom[]) {
    console.log('gameRooms', gameRooms);
    this.playerGameRooms = gameRooms;
    if (player.currentGameRoom) {
      this.currentGame = gameRooms.find((gameRoom) => gameRoom.gameRoomId === player.currentGameRoom);
    }
    console.log('currentPlayerGameRoom', this.currentGame);

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
      player.currentGameRoom = gameRoom.gameRoomId;
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

  onGoToGame(player: Player, gameRoom: GameRoom) {
    // this.gameRoomService.updateGameRoom(gameRoom);
    // this.auth.updateUserData(player);
  }

  async onLeaveGameRoom(player: Player, gameRoom: GameRoom) {
    let headerText = 'Leave Game Room?';
    let bodyText = 'Are you sure you want to leave this game room? You can return or be invited back at any time!';
    
    const modal = await this.modalCtrl.create({
      component: ConfirmSelectionComponent,
      componentProps: {
        'headerTxt': headerText,
        'bodyTxt': bodyText,
        'cancelBtnTxt': 'Cancel',
        'confirmBtnTxt': 'Leave'
      }
    });
    modal.present();

    // Once Model Is Dismissed
    const { data } = await modal.onWillDismiss();
    if (data && data.isConfirm) {
      
    }
  }

  async onDeleteGame(player: Player, gameRoom: GameRoom) {
    let headerText = 'Delete Game Room?';
    let bodyText = 'Are you sure you want to delete this game room? This cannot be undone!';
    
    const modal = await this.modalCtrl.create({
      component: ConfirmSelectionComponent,
      componentProps: {
        'headerTxt': headerText,
        'bodyTxt': bodyText,
        'cancelBtnTxt': 'Cancel',
        'confirmBtnTxt': 'Delete Forever'
      }
    });
    modal.present();

    // Once Model Is Dismissed
    const { data } = await modal.onWillDismiss();
    if (data && data.isConfirm) {
      // delete gameroom from player object
      player.gameRooms.splice(player.gameRooms.indexOf(gameRoom.gameRoomId), 1);
      // if gameroom is the current gameroom, set current gameroom to null
      if (player.currentGameRoom === gameRoom.gameRoomId) {
        player.currentGameRoom = null;
      }
      // update firebase
      this.gameRoomService.deleteGameRoom(gameRoom.gameRoomId);
    }




  }

  ngOnDestroy() {
    if (this.gamesSubs$)
      this.gamesSubs$.unsubscribe();
  }

}

import { Component, OnInit } from '@angular/core';
import { Player } from '../interfaces/player.interface';
import { AuthService } from '../services/auth.service';
import { CharactersService } from '../services/characters.service';
import { FirebaseDataService } from '../services/firebase-data.service';
import { ModalController } from '@ionic/angular';
import { CreateRoomComponent } from '../modals/create-room/create-room.component';
import { CreateGameRoomObject } from '../interfaces/game-room.interface';
import { GameRoomsService } from '../services/game-rooms.service';

@Component({
  selector: 'app-main-lobby',
  templateUrl: './main-lobby.page.html',
  styleUrls: ['./main-lobby.page.scss'],
})
export class MainLobbyPage implements OnInit {

  isLoading = true;
  avatarText: string = ''
  photoUrl: string = '';
  isCreateRoomModalOpen: boolean = false;
  createRoomName: string = '';

  constructor(
    public auth: AuthService,
    public charactersService: CharactersService,
    private firebase: FirebaseDataService,
    private gameRooms: GameRoomsService,
    private modalCtrl: ModalController) { }

  ngOnInit() {

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
      // Add game room ID to each character in game room then save it to cloud.
      this.charactersService.selectedCharacters.getValue().forEach((character) => {
        if(!character.gameRoomIds) {
          character['gameRoomIds'] = [];
        }
        character.gameRoomIds.push(gameRoom.gameRoomId);
        this.firebase.updateCharacter(character);
      });
      console.log('save this to firebase, ', gameRoom);
      this.gameRooms.createGameRoom(gameRoom);
    }
  }

}

import { Component, OnDestroy, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Player } from '../interfaces/player.interface';
import { AuthService } from '../services/auth.service';
import { CharactersService } from '../services/characters.service';
import { FirebaseDataService } from '../services/firebase-data.service';
import { ModalController } from '@ionic/angular';
import { CreateRoomComponent } from '../modals/create-room/create-room.component';
import { CreateGameRoomObject, GameRoom } from '../interfaces/game-room.interface';
import { GameRoomsService } from '../services/game-rooms.service';
import { Observable, Subscription, take } from 'rxjs';
import { ConfirmSelectionComponent } from '../modals/confirm-selection/confirm-selection.component';
import { InformPlayerComponent } from '../modals/inform-player/inform-player.component';
import { Character } from '../interfaces/character.interface';
import { Router } from '@angular/router';
import { SelectCharacterPage } from '../select-character/select-character.page';

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
  characterSubs$: Subscription;
  playerCharacters: WritableSignal<Character[]> = signal([]);
  playerGameRooms: GameRoom[] = [];
  publicGameRooms: GameRoom[] = [];
  currentGame: GameRoom;
  characterPortraits: Map<string, string> = new Map<string, string>();

  constructor(
    public auth: AuthService,
    public charactersService: CharactersService,
    public firebase: FirebaseDataService,
    private gameRoomService: GameRoomsService,
    private modalCtrl: ModalController,
    private router: Router) {
    // Get all public rooms
    this.gameRoomService.getAllPublicGameRooms().pipe(takeUntilDestroyed()).subscribe((gameRooms: GameRoom[]) => {
      this.publicGameRooms = gameRooms;
    });
    this.auth.Player$.pipe(takeUntilDestroyed()).subscribe((player) => {
      if (player) {
        console.log('player', player);
        this.characterSubs$ = this.firebase.getAllCharacters(player.playerId).subscribe((characters: Character[]) => {
          this.playerCharacters.set(characters);
          this.setSelectedCharacters(player.selectedCharactersIds);
        });
        this.gamesSubs$ = this.gameRoomService.getAllGameRoomsWithPlayerId(player.playerId).subscribe((gameRooms: GameRoom[]) => {
          this.setGameRooms(player, gameRooms);
          // get all portraits for all characters in these game rooms
          if (this.playerGameRooms && this.playerGameRooms.length > 0) {
            this.playerGameRooms.forEach(gameroom => {
              if (gameroom && gameroom.charactersId) {
                this.firebase.getCharacters(gameroom.charactersId).then((characters) => {
                  if (characters) {
                    characters.forEach(character => {
                      this.characterPortraits.set(character.characterId, character.portraitUrl);
                    });
                  }
                }).catch((error) => {
                  console.log('No characters were found');
                });
              }
            });
          }
        });
      }
    });
  }

  setSelectedCharacters(selectCharactersId: string[]) {
    const allCharacters = this.playerCharacters();
    allCharacters.forEach(character => {
      if (selectCharactersId.includes(character.characterId)) {
        character.isPlayerUsing = true;
      } else {
        character.isPlayerUsing = false;
      }
    });
    this.playerCharacters.set(allCharacters);
  }

  ngOnInit() {
    // Get all ame rooms with the player ID from firebase use pipe to unsubscribe once component is destroyed.
    this.firebase.getCharacterPortrait('claudio_teles_turock_1684674587237').pipe(take(1)).subscribe((portraitUrl) => {
      console.log('portraitUrl', portraitUrl);
    });
  }


  setGameRooms(player: Player, gameRooms: GameRoom[]) {
    console.log('gameRooms', gameRooms);
    if (gameRooms && gameRooms.length > 0) {
      this.playerGameRooms = gameRooms;
    }
    if (player && player.currentGameRoom) {
      this.currentGame = gameRooms.find((gameRoom) => gameRoom.gameRoomId === player.currentGameRoom);
    }
    console.log('currentPlayerGameRoom', this.currentGame);

  }

  onViewCharacter(index: number, character: Character) {
    const characters: Character[] = [];
    characters.push(character);
    this.charactersService.selectedCharacters.next(characters);
    console.log('view character', index);
    this.router.navigate(['/character-tabs/main'], {
      queryParams: {
        breadcrumb: 'main-lobby',
        viewMode: 'personal',
        characterIndex: index,
        characterId: character.characterId
      }
    });
  }

  async onJoinNewGame(player: Player, gameroom: GameRoom) {
    // Make sure the gameroom has room for the player
    if (gameroom.playersAlloted !== 0 && gameroom.playersId.length >= gameroom.playersAlloted) {
      console.log('This game room is full');
      const modal = await this.modalCtrl.create({
        component: InformPlayerComponent,
        componentProps: {
          'headerTxt': 'Cant Join Game Room',
          'bodyTxt': 'This game room is full. Try joining another game room.',
        }
      });
      modal.present();
      return;
    } else {
      // Add game room ID to the player then save it to cloud.
      player.gameRooms.push(gameroom.gameRoomId);
      player.currentGameRoom = gameroom.gameRoomId;
      this.auth.updateUserData(player);
      console.log('updated player', player);
      // Add player ID to the game room then save it to cloud.
      gameroom.playersId.push(player.playerId);
      this.gameRoomService.updateGameRoom(gameroom);
    }
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

  isPlayerCharacterInRoom(player: Player, gameRoom: GameRoom) {
    // if you are the owner of the game room you are always in the room
    if (player && gameRoom && gameRoom.gameMasterId === player.playerId) {
      return true;
    }
      let value = false;
      // check to see if any of the players characters are in the game room
      if (player && player.selectedCharactersIds && gameRoom && gameRoom.charactersId) {
        value = player.selectedCharactersIds.some((characterId) => gameRoom.charactersId.includes(characterId));
      } else {
        value = false;
      }
      return value;
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
        // Add game room ID to the player then save it to cloud.
        player.gameRooms.push(gameRoom.gameRoomId);
        player.currentGameRoom = gameRoom.gameRoomId;
        this.auth.updateUserData(player);
        console.log('save this to firebase, ', gameRoom);
        this.gameRoomService.createGameRoom(gameRoom);
      }
    }

    onContinueCurrentGame(player: Player, currentGame: GameRoom) {
      this.onGoToGame(player, currentGame);
      this.router.navigate(['/character-tabs/main'], {
        queryParams: {
          breadcrumb: 'main-lobby',
          viewMode: 'party',
          characterIndex: 0
        }
      });
    }

    onGoToGame(player: Player, gameRoom: GameRoom) {
      player.currentGameRoom = gameRoom.gameRoomId;
      // set the players selected characters to the characters he has in this room if there are any.
      const characters = this.playerCharacters().filter((character) => gameRoom.charactersId.includes(character.characterId));
      this.charactersService.selectedCharacters.next(characters);
      if (characters) {
        this.auth.updatePlayerSelectedCharacters(characters, player).then(() => {
          player.currentGameRoom = gameRoom.gameRoomId;
          this.setSelectedCharacters(player.selectedCharactersIds);
        });
      }
    }

  async onAddCharactersToGame(player: Player, gameRoom: GameRoom) {
      const modal = await this.modalCtrl.create({
        component: SelectCharacterPage,
        componentProps: {
          gameRoom
        }
      });
      modal.present();

      const { data } = await modal.onWillDismiss();
      console.log('data', data);
      // add characters to the game room
      if (data && data.selectedCharacters) {
        // add the characters to the game room if they are not already in the room
        if (gameRoom && gameRoom.charactersId) {
          data.selectedCharacters.forEach((characterId) => {
            if (!gameRoom.charactersId.includes(characterId)) {
              gameRoom.charactersId.push(characterId);
            }
          });
        }
        this.gameRoomService.updateGameRoom(gameRoom);
      }
      // update the player with the selected characters
      if (data && data.selectedCharacters) {
        player.selectedCharactersIds = player.selectedCharactersIds.concat(data.selectedCharacters);
        this.auth.updateUserData(player);
      }
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
        this.gameRoomService.leaveGameRoom(player, gameRoom);
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
        // Deleted the gameroom ID from the players and Characters then deletes the game
        this.gameRoomService.deleteGameRoom(gameRoom);
      }
    }

    ngOnDestroy() {
      if (this.gamesSubs$)
        this.gamesSubs$.unsubscribe();
      if (this.characterSubs$)
        this.characterSubs$.unsubscribe();
    }

  }

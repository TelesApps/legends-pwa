import { Component, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Character } from '../interfaces/character.interface';
import { Player } from '../interfaces/player.interface';
import { ConfirmSelectionComponent } from '../modals/confirm-selection/confirm-selection.component';
import { InformPlayerComponent } from '../modals/inform-player/inform-player.component';
import { AuthService } from '../services/auth.service';
import { CharactersService } from '../services/characters.service';
import { FirebaseDataService } from '../services/firebase-data.service';
import { GameRoom } from '../interfaces/game-room.interface';

@Component({
  selector: 'app-select-character',
  templateUrl: './select-character.page.html',
  styleUrls: ['./select-character.page.scss'],
})
export class SelectCharacterPage implements OnInit {

  characters: Array<Character> = [];
  backUrl: string = '';
  @Input() gameRoom: GameRoom;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    private firebaseData: FirebaseDataService,
    public modalController: ModalController,
    public characterSer: CharactersService) { }

  ngOnInit() {
    this.auth.getPlayer().then((player: Player) => {
      console.log('got player', player);
      this.firebaseData.getAllCharactersData(player.playerId).then((characters: Array<Character>) => {
        console.log('got all characters', characters);
        characters.forEach(chararacter => {
          this.characters.push(chararacter);
          // if character.isPlayerUsing is undefined, set it to false
          if (chararacter.isPlayerUsing === undefined) {
            chararacter.isPlayerUsing = false;
          }
          // if character id is found inside player.selectedCharactersIds, set isPlayerUsing to true
          if (player.selectedCharactersIds.find(id => id === chararacter.characterId)) {
            chararacter.isPlayerUsing = true;
          } else {
            chararacter.isPlayerUsing = false;
          }
        });
      });
    })

    this.auth.Player$.pipe().subscribe((player: Player) => {
    });
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      if (params.breadcrumb) {
        this.backUrl = params.breadcrumb;
      } else {
        this.backUrl = 'main-lobby'
      }
    })
  }

  async isCharacterSelected(id: string) {
    const player = await this.auth.getPlayer();
    return player.selectedCharactersIds.find(id => id === id);
  }

  async onCharacterClick(event, character: Character) {
    console.log('character', character);
    character.isPlayerUsing = !character.isPlayerUsing;
  }

  async onDeleteCharacters() {
    const toDelete = this.characters.filter(c => c.isPlayerUsing);
    let headerText = '';
    let bodyText = '';
    if (toDelete.length < 1 || toDelete.length > 1) {
      if (toDelete.length < 1) {
        headerText = 'Select a character';
        bodyText = `You do not have any characters selected, please select one character then click to delete it`;
      }
      else if (toDelete.length > 1) {
        headerText = 'Too many characters selected';
        bodyText = `Please only select and delete one character at a time.`;
      }
      const modal = await this.modalController.create({
        component: InformPlayerComponent,
        componentProps: {
          'headerTxt': headerText,
          'bodyTxt': bodyText,
        }
      });
      modal.present();
    }
    else {
      const character = this.characters.find(c => c.isPlayerUsing);
      headerText = 'Are You Sure?';
      bodyText = `${character.characterName} Will be deleted forever along with all of his stats, this cannot be undone!!! 
      Are you sure?`;
      const modal = await this.modalController.create({
        component: ConfirmSelectionComponent,
        componentProps: {
          'headerTxt': headerText,
          'bodyTxt': bodyText,
          'cancelBtnTxt': 'Cancel',
          'confirmBtnTxt': 'Delete Forever'
        }
      });
      modal.present();
      const { data } = await modal.onWillDismiss();
      if (data && data.isConfirm) {
        const player: Player = await this.auth.getPlayer();
        const index = player.charactersId.findIndex(id => id == character.characterId);
        if (index !== -1)
          player.charactersId.splice(index, 1);
        player.selectedCharactersIds = [];
        this.auth.updateUserData(player);
        this.firebaseData.deleteCharacter(character.characterId);
      }

    }
  }
  async onFinishSelection() {
    const player: Player = await this.auth.getPlayer();
    console.log('player onFinish', player);
    this.characterSer.selectedCharacters.next([]);
    let selected: string[] = [];
    this.characters.forEach(character => {
      if (character.isPlayerUsing) {
        selected.push(character.characterId);
        this.characterSer.selectedCharacters.getValue().push(character);
      }
    });
    console.log('selected', selected);
    player.selectedCharactersIds = selected;

    if (this.gameRoom) {
      this.modalController.dismiss({
        'selectedCharacters': selected,
        'player' : player,
      })
    } else {
      console.log('Updating User Data in Firebase', player);
      this.auth.updateUserData(player);

      this.router.navigate(['/'])
    }

  }

  isBtnDisabled() {
    if(!this.gameRoom) return false;
    let selected: string[] = [];
    this.characters.forEach(character => {
      if (character.isPlayerUsing) {
        selected.push(character.characterId);
      }
    });
    if (selected.length == 0) {
      return true;
    } else if (this.gameRoom && selected.length > this.gameRoom.charactersPerPlayerAlloted) {
      return true;
    } else {
      return false;
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

}

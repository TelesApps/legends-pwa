import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Character } from '../interfaces/character.interface';
import { Player } from '../interfaces/player.interface';
import { ConfirmSelectionComponent } from '../modals/confirm-selection/confirm-selection.component';
import { InformPlayerComponent } from '../modals/inform-player/inform-player.component';
import { AuthService } from '../services/auth.service';
import { CharactersService } from '../services/characters.service';
import { FirebaseDataService } from '../services/firebase-data.service';

@Component({
  selector: 'app-select-character',
  templateUrl: './select-character.page.html',
  styleUrls: ['./select-character.page.scss'],
})
export class SelectCharacterPage implements OnInit {

  characters: Array<Character> = [];
  backUrl: string = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private firebaseData: FirebaseDataService,
    public modalController: ModalController,
    public characterSer: CharactersService) { }

  ngOnInit() {
    this.auth.getPlayer().then((player: Player) => {
      console.log('got player', player);
      this.firebaseData.getAllCharacters(player.playerId).subscribe((characters: Array<Character>) => {
        player.charactersId.forEach(id => {
          const selectedCharacter = characters.find(c => c.characterId === id);
          selectedCharacter.isPlayerUsing = true;
        });
        console.log('characters', characters);
        this.characters = characters;
      });
    })
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

  onCharacterClick(event, character: Character) {
    if (event.detail.checked) {
      if (this.characterSer.selectedCharacters.find(c => c.characterId == character.characterId) == undefined) {
        character.isPlayerUsing = true;
        this.characterSer.selectedCharacters.push(character);
      }
    } else {
      character.isPlayerUsing = false;
      const index = this.characterSer.selectedCharacters.findIndex(c => c.characterId == character.characterId);
      this.characterSer.selectedCharacters.splice(index, 1);
    }
  }

  async onDeleteCharacters() {
    let headerText = '';
    let bodyText = '';
    if (this.characterSer.selectedCharacters.length < 1 || this.characterSer.selectedCharacters.length > 1) {
      if (this.characterSer.selectedCharacters.length < 1) {
        headerText = 'Select a character';
        bodyText = `You do not have any characters selected, please select one character then click to delete it`;
      }
      else if (this.characterSer.selectedCharacters.length > 1) {
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
      headerText = 'Are You Sure?';
      bodyText = `${this.characterSer.selectedCharacters[0].characterName} Will be deleted forever along with all of his stats, this cannot be undone!!! 
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
        console.log('make call to delete characters');
        this.firebaseData.deleteCharacter(this.characterSer.selectedCharacters[0].characterId);
      }

    }
  }

  async onFinishSelection() {
    const player = await this.auth.getPlayer();
    console.log('player onFinish', player);
    let selected: string[] = [];
    this.characterSer.selectedCharacters.forEach(character => {
      selected.push(character.characterId);
    });
    if(selected.toString() !== player.selectedCharactersIds.toString()) {
      console.log('Updating User Data in Firebase', player);
      player.selectedCharactersIds = selected;
      this.auth.updateUserData(player);
    }
    this.router.navigate(['/'])
  }

}

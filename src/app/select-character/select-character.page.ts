import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Character } from '../interfaces/character.interface';
import { ConfirmSelectionComponent } from '../modals/confirm-selection/confirm-selection.component';
import { InformPlayerComponent } from '../modals/inform-player/inform-player.component';
import { FirebaseDataService } from '../services/firebase-data.service';

@Component({
  selector: 'app-select-character',
  templateUrl: './select-character.page.html',
  styleUrls: ['./select-character.page.scss'],
})
export class SelectCharacterPage implements OnInit {

  characters: Array<Character> = [];
  selectedCharacters: Array<Character> = [];
  backUrl: string = '';
  constructor(
    private route: ActivatedRoute,
    private firebaseData: FirebaseDataService,
    public modalController: ModalController,) { }

  ngOnInit() {
    this.firebaseData.getAllCharacters().subscribe((characters: Array<Character>) => {
      console.log('characters', characters);
      this.characters = characters;
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

  onCharacterClick(event, character: Character) {
    if (event.detail.checked) {
      if (this.selectedCharacters.find(c => c.characterId == character.characterId) == undefined) {
        this.selectedCharacters.push(character);
      }
    } else {
      const index = this.selectedCharacters.findIndex(c => c.characterId == character.characterId);
      this.selectedCharacters.splice(index, 1);
    }
  }

  async onDeleteCharacters() {
    let headerText = '';
    let bodyText = '';
    if (this.selectedCharacters.length < 1 || this.selectedCharacters.length > 1) {
      if (this.selectedCharacters.length < 1) {
        headerText = 'Select a character';
        bodyText = `You do not have any characters selected, please select one character then click to delete it`;
      }
      else if (this.selectedCharacters.length > 1) {
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
      bodyText = `${this.selectedCharacters[0].characterName} Will be deleted forever along with all of his stats, this cannot be undone!!! 
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
      }

    }
  }

}

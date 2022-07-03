import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Character } from '../interfaces/character.interface';
import { ConfirmSelectionComponent } from '../modals/confirm-selection/confirm-selection.component';
import { CharacterCreationService } from '../services/character-creation.service';

@Component({
  selector: 'app-character-creation-tabs',
  templateUrl: './character-creation-tabs.page.html',
  styleUrls: ['./character-creation-tabs.page.scss'],
})
export class CharacterCreationTabsPage implements OnInit {

  character: Character;
  constructor(public modalController: ModalController, private router: Router, public creation: CharacterCreationService) {
    this.creation.setCharacterStats();
   }

  ngOnInit() {
    this.creation.characterSubj.subscribe((character) => this.character = character);
  }

  async onCloseCreation() {
    console.log('on Close called');
    const modal = await this.modalController.create({
      component: ConfirmSelectionComponent,
      componentProps: {
        'headerTxt': 'Cancel Character Creation?',
        'bodyTxt': `This will delete all the changes you've made to this character`,
      }
    });
    modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data.isConfirm) {
      this.creation.closeCreation();
      this.router.navigate(['/select-character']);
    }
  }

}

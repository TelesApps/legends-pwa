import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ConfirmSelectionComponent } from '../modals/confirm-selection/confirm-selection.component';

@Component({
  selector: 'app-character-creation-tabs',
  templateUrl: './character-creation-tabs.page.html',
  styleUrls: ['./character-creation-tabs.page.scss'],
})
export class CharacterCreationTabsPage implements OnInit {

  constructor(public modalController: ModalController, private router: Router) { }

  ngOnInit() {
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
    if(data.isConfirm) {
      this.router.navigate(['/select-character']);
    }
  }

}

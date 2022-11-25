import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { PortraitSelectionComponent } from './portrait-selection/portrait-selection.component';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {

  portraits: Array<any> = []
  constructor(public modalController: ModalController, private fireData: FirebaseDataService) { }

  ngOnInit() {
  }

  async onPortraitClick() {

    // console.log('calling firebase');
    // this.fireData.$allPortraits.subscribe((allUrls) => {
    //   console.log("allUrls", allUrls);
    //   this.portraits = allUrls;
    // })
    // this.fireData.loadAllPortraits();

    const modal = await this.modalController.create({
      component: PortraitSelectionComponent,
      componentProps: {
        'selectedPortrait': 'something',
      }
    });
    modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data.isConfirm) {

    }
  }

}

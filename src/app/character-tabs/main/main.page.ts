import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Character } from 'src/app/interfaces/character.interface';
import { MoreDetailsComponent } from 'src/app/modals/more-details/more-details.component';
import { AirtableDataService } from 'src/app/services/airtable-data.service';
import { CharactersService } from 'src/app/services/characters.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  character: Character;
  constructor(public characterServ: CharactersService, public dataService: AirtableDataService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.characterServ.selectedCharacters.subscribe((chracters) => {
      this.character = chracters[0];
    })
  }

  getImgFromId(id: string, defaultUrl: string): string {
    if (id) {
      const item = this.dataService.allItems.find(i => i.airtable_id === id);
      if (item) return item.image[0].url;
      else return defaultUrl;
    }
    else {
      return defaultUrl;
    }
  }

  async openMoreDetails() {
    const modal = await this.modalCtrl.create({
      component: MoreDetailsComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(`Hello, ${data}!`);
    }
  }


}

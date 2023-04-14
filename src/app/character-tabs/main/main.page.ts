import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Character } from 'src/app/interfaces/character.interface';
import { BodyPart, Stat } from 'src/app/interfaces/status-effect.interface';
import { MoreDetailsComponent } from 'src/app/modals/more-details/more-details.component';
import { AirtableDataService } from 'src/app/services/airtable-data.service';
import { CharactersService } from 'src/app/services/characters.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  Stat = Stat;
  BodyPart = BodyPart;
  character: Character;
  constructor(public characterServ: CharactersService, public airtable: AirtableDataService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.airtable.loadDatabase();
    this.characterServ.selectedCharacters.subscribe((chracters) => {
      this.character = chracters[0];
    })
  }

  getImgFromId(id: string, defaultUrl: string): string {
    if (id) {
      const item = this.airtable.$allItems.getValue().find(i => i.airtable_id === id);
      if (item) return item.image[0].url;
      else return defaultUrl;
    }
    else {
      return defaultUrl;
    }
  }

  isRangeWeapon(itemId: string) {
    if (itemId) {
      return this.airtable.doesItemContainTag(itemId, 'range');
    } else return false;
  }

  getTotalWeaponDmg(mainHandId: string, offHandId: string, isRangedCalc = false) {
    let mainHand;
    let offHand;
    if (mainHandId) mainHand = this.airtable.getItemById(mainHandId);
    if (offHandId) offHand = this.airtable.getItemById(offHandId);
    let totalDmg = 0;
    if (mainHand) {
      totalDmg += this.characterServ.getWeaponDmg(mainHand, isRangedCalc);
    }
    if (!this.characterServ.isTwoHandedWeapon(mainHandId) && offHand) {
      totalDmg += this.characterServ.getWeaponDmg(offHand, isRangedCalc);
    }
    return totalDmg;
  }


  async openMoreDetails(stat?: Stat, bodyPart?: BodyPart) {
    const modal = await this.modalCtrl.create({
      component: MoreDetailsComponent,
      componentProps: {
        'headerTxt': 'stat: ' + stat,
        'statDetails': `bodyPart: ` + bodyPart,
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(`Hello, ${data}!`);
    }
  }


}

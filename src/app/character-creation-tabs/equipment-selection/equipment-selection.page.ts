import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Character } from 'src/app/interfaces/character.interface';
import { Item } from 'src/app/interfaces/item.interface';
import { AirtableDataService } from 'src/app/services/airtable-data.service';
import { CharacterCreationService } from 'src/app/services/character-creation.service';

@Component({
  selector: 'app-equipment-selection',
  templateUrl: './equipment-selection.page.html',
  styleUrls: ['./equipment-selection.page.scss'],
})
export class EquipmentSelectionPage implements OnInit {

  character: Character
  constructor(public creation: CharacterCreationService, public dataService: AirtableDataService, private router: Router) { }

  ngOnInit() {
    console.log('item selection: ', this.creation.itemSelection);
    this.creation.characterSubj.subscribe((character) => {
      this.character = character;
      if (this.creation.itemSelection.onSelectedItem) {
        this.onEquipmentSelected(this.creation.itemSelection.onSelectedItem.airtable_id);
      }
    });
    setTimeout(() => {
      console.log('character', this.character);
    }, 1000);
  }

  onSelectEquipment(bodyProperty: string, currentId: string, hand?: 'main-hand' | 'off-hand') {
    if (currentId) {
      const currentItem = this.dataService.getItemById(currentId);
      if (currentItem)
        this.creation.itemSelection.currentlyEquipped = currentItem;
    }
    this.creation.itemSelection.bodyProperty = bodyProperty;
    this.creation.itemSelection.isStartingItem = true;
    this.creation.itemSelection.hand = hand;
    this.router.navigate(['/encyclopedia-tabs/items-list'], {
      replaceUrl: true,
      queryParams: {
        breadcrumb: '/character-creation-tabs/equipment-selection',
        bodyProperty: bodyProperty,
        isSelectType: bodyProperty
      }
    });
  }

  onEquipmentSelected(selectedId: string) {
    if (this.creation.itemSelection.hand === 'main-hand') {
      this.character.equipments.mainHandId = selectedId;
    } else if (this.creation.itemSelection.hand === 'off-hand') {
      this.character.equipments.offHandId = selectedId;
    } else {
      switch (this.creation.itemSelection.bodyProperty) {
        case 'head': this.character.equipments.headId = selectedId;   break;
        case 'chest': this.character.equipments.chestId = selectedId; break;
        case 'hands': this.character.equipments.handsId = selectedId; break;
        case 'legs' : this.character.equipments.legsId = selectedId;  break;
        case 'boots' : this.character.equipments.feetId = selectedId; break;
      }

    }
    this.creation.initItemSelection();

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

}

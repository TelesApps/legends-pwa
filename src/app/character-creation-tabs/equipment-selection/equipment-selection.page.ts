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

  isShowHead: boolean = false;
  character: Character
  constructor(public creation: CharacterCreationService, public dataService: AirtableDataService, private router: Router) { }

  ngOnInit() {
    console.log('item selection: ', this.creation.itemSelection);
    this.creation.characterSubj.subscribe((character) => {
      this.character = character;
    });
    if(this.creation.itemSelection.onSelectedItem) {
      this.character.equipments.headId = this.creation.itemSelection.onSelectedItem.airtable_id
    }
    setTimeout(() => {
      console.log('character', this.character);
    }, 1000);
  }

  onSelectEquipment(bodyProperty: string, currentId: string) {
    if (currentId) {
      const currentItem = this.dataService.getItemById(currentId);
      if (currentItem)
        this.creation.itemSelection.currentlyEquipped = currentItem;
    }
    this.creation.itemSelection.bodyProperty = bodyProperty;
    this.creation.itemSelection.isStartingItem = true;
    this.router.navigate(['/encyclopedia-tabs/items-list'], {
      replaceUrl: true,
      queryParams: {
        breadcrumb: '/character-creation-tabs/equipment-selection',
        bodyProperty: bodyProperty,
        isSelectType: bodyProperty
      }
    });
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Character } from 'src/app/interfaces/character.interface';
import { Item } from 'src/app/interfaces/item.interface';
import { AirtableDataService } from 'src/app/services/airtable-data.service';
import { CalculationsService } from 'src/app/services/calculations.service';
import { CharacterCreationService } from 'src/app/services/character-creation.service';

@Component({
  selector: 'app-equipment-selection',
  templateUrl: './equipment-selection.page.html',
  styleUrls: ['./equipment-selection.page.scss'],
})
export class EquipmentSelectionPage implements OnInit {

  character: Character
  constructor(
    public creation: CharacterCreationService, 
    public dataService: AirtableDataService, 
    private router: Router, 
    private calculation: CalculationsService
    ) { }

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

  onSelectEquipment(bodyProperty: string, currentId: string, hand?: 'main-hand' | 'off-hand' | 'backpack') {
    if (currentId) {
      const currentItem = this.dataService.getItemById(currentId);
      if (currentItem)
        this.creation.itemSelection.currentlyEquipped = currentItem;
    }
    this.creation.itemSelection.bodyProperty = bodyProperty;
    this.creation.itemSelection.isStartingItem = true;
    this.creation.itemSelection.hand = hand;
    const isSelectType = hand ? 'all' : bodyProperty;
    this.router.navigate(['/encyclopedia-tabs/items-list'], {
      replaceUrl: true,
      queryParams: {
        breadcrumb: '/character-creation-tabs/equipment-selection',
        bodyProperty: bodyProperty,
        isSelectType: isSelectType,
        hand: hand,
      }
    });
  }

  onEquipmentSelected(selectedId: string) {
    this.calculation.calculateEffectsFromStrings(this.creation.itemSelection.onSelectedItem.effects);
    if (this.creation.itemSelection.hand === 'main-hand') {
      this.character.equipments.mainHandId = selectedId;
      if (this.isTwoHands(selectedId)) {
        this.character.equipments.offHandId = selectedId;
      } else {
        if(this.isTwoHands(this.character.equipments.offHandId)) {
          this.character.equipments.offHandId = '';
        }
      }
    } else if (this.creation.itemSelection.hand === 'off-hand') {
      this.character.equipments.offHandId = selectedId;
      if (this.isTwoHands(selectedId))
        this.character.equipments.mainHandId = selectedId;
      else {
        const mainHandItem = this.dataService.getItemById(this.character.equipments.mainHandId);
        if (mainHandItem && mainHandItem.tags.find(
          t => t == '2 Hands' || t == '2 hands' || t == '2Hands' || t == '2hands' || t == '2 Hand' || t == '2 hand')) {
          this.character.equipments.mainHandId = '';
        }
      }
    } else if (this.creation.itemSelection.bodyProperty === 'trinket') {
      this.character.equipments.trinketsId.push(selectedId);
    } else if (this.creation.itemSelection.hand === 'backpack') {
      this.character.equipments.backPack.push(selectedId);
    } else {
      switch (this.creation.itemSelection.bodyProperty) {
        case 'head': this.character.equipments.headId = selectedId; break;
        case 'chest': this.character.equipments.chestId = selectedId; break;
        case 'hands': this.character.equipments.handsId = selectedId; break;
        case 'legs': this.character.equipments.legsId = selectedId; break;
        case 'boots': this.character.equipments.feetId = selectedId; break;
      }

    }
    this.creation.initItemSelection();
  }

  isTwoHands(id: string){
    const item = this.dataService.getItemById(id);
    if(item && item.tags) {
      return item.tags.find(t => t == '2 Hands' || t == '2 hands' || t == '2Hands' || t == '2hands' || t == '2 Hand' || t == '2 hand');
    } else {
      return '';
    }
  }

  onRemoveTrinket(index: number) {
    this.character.equipments.trinketsId.splice(index, 1);
  }
  onRemoveBackpack(index: number) {
    this.character.equipments.backPack.splice(index, 1);
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

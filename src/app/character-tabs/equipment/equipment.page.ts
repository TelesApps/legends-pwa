import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonTabs } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { Character } from 'src/app/interfaces/character.interface';
import { Item, ItemSelection } from 'src/app/interfaces/item.interface';
import { AirtableDataService } from 'src/app/services/airtable-data.service';
import { CharacterCreationService } from 'src/app/services/character-creation.service';
import { CharactersService } from 'src/app/services/characters.service';
import { ModalController } from '@ionic/angular';
import { ConfirmSelectionComponent } from 'src/app/modals/confirm-selection/confirm-selection.component';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.page.html',
  styleUrls: ['./equipment.page.scss'],
})
export class EquipmentPage implements OnInit {

  backPackSelection: ItemSelection;

  constructor(
    public airtable: AirtableDataService,
    public characterServ: CharactersService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private tabs: IonTabs,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.airtable.loadDatabase();
    this.activeRoute.queryParams.pipe(take(1)).subscribe((params) => {
      if (params.selected_id) {
        this.onEquipmentAddedToBackback(params.selected_id);
      }
    });
    this.tabs.ionTabsDidChange.subscribe((event) => {
      this.backPackSelection = null;
    });
  }

  onStartItemSelectionFromBackpack(bodyProperty: string, currentId: string, hand?: 'main-hand' | 'off-hand' | 'backpack') {
    const currentItem = this.airtable.getItemById(currentId);
    this.backPackSelection = {
      currentlyEquipped: currentItem ? currentItem : null,
      bodyProperty: bodyProperty,
      isStartingItem: false,
      hand: hand,
      onSelectedItem: null,
    }

    console.log('onSelectEquipment: ', this.backPackSelection);
  }

  onEquipItem(selectedId: string) {
    const characters = this.characterServ.selectedCharacters.getValue();
    const viewIndex = this.characterServ.viewIndex;
    if (this.backPackSelection.hand === 'main-hand') {
      if (characters[viewIndex].equipments.mainHandId)
        characters[viewIndex].equipments.backPack.push(characters[viewIndex].equipments.mainHandId);
      characters[viewIndex].equipments.mainHandId = selectedId;
      if (this.isTwoHands(selectedId)) {
        if (characters[viewIndex].equipments.offHandId)
          characters[viewIndex].equipments.backPack.push(characters[viewIndex].equipments.offHandId);
        characters[viewIndex].equipments.offHandId = selectedId;
      } else {
        if (characters[viewIndex].equipments.offHandId && this.isTwoHands(characters[viewIndex].equipments.offHandId)) {
          characters[viewIndex].equipments.offHandId = '';
        }
      }
    } else if (this.backPackSelection.hand === 'off-hand') {
      if (characters[viewIndex].equipments.offHandId)
        characters[viewIndex].equipments.backPack.push(characters[viewIndex].equipments.offHandId);
      characters[viewIndex].equipments.offHandId = selectedId;
      if (this.isTwoHands(selectedId)) {
        if (characters[viewIndex].equipments.mainHandId)
          characters[viewIndex].equipments.backPack.push(characters[viewIndex].equipments.mainHandId);
        characters[viewIndex].equipments.mainHandId = selectedId;
      }
      else {
        const mainHandItem = this.airtable.getItemById(characters[viewIndex].equipments.mainHandId);
        if (mainHandItem && mainHandItem.tags.find(
          t => t == '2 Hands' || t == '2 hands' || t == '2Hands' || t == '2hands' || t == '2 Hand' || t == '2 hand')) {
          characters[viewIndex].equipments.mainHandId = '';
        }
      }
    } else if (this.backPackSelection.bodyProperty === 'trinket') {
      characters[viewIndex].equipments.trinketsId.push(selectedId);
    } else if (this.backPackSelection.hand === 'backpack') {
      characters[viewIndex].equipments.backPack.push(selectedId);
    } else {
      switch (this.backPackSelection.bodyProperty) {
        case 'head': characters[viewIndex].equipments.headId = selectedId; break;
        case 'chest': characters[viewIndex].equipments.chestId = selectedId; break;
        case 'hands': characters[viewIndex].equipments.handsId = selectedId; break;
        case 'legs': characters[viewIndex].equipments.legsId = selectedId; break;
        case 'boots': characters[viewIndex].equipments.feetId = selectedId; break;
      }
    }
    // remove item from backpack since its now equiped
    characters[viewIndex].equipments.backPack = characters[viewIndex].equipments.backPack.filter(id => id !== selectedId);
    this.backPackSelection = null;

    this.characterServ.calculateCharacterStats(characters[viewIndex]);
    this.characterServ.selectedCharacters.next(characters);

    // this.creation.initItemSelection();
  }

  onRemoveEquipment(bodyPart: 'head' | 'main-hand' | 'off-hand' | 'chest' | 'hands' | 'legs' | 'feet', equipmentId: string) {
    const item = this.airtable.getItemById(equipmentId);
    const characters = this.characterServ.selectedCharacters.getValue();
    const viewIndex = this.characterServ.viewIndex;
    // add item to backpack
    characters[viewIndex].equipments.backPack.push(equipmentId);
    // Remove item from body part
    if (bodyPart === 'head') characters[viewIndex].equipments.headId = '';
    if (bodyPart === 'main-hand') {
      characters[viewIndex].equipments.mainHandId = ''
      if (this.isTwoHands('', item)) characters[viewIndex].equipments.offHandId = '';
    };
    if (bodyPart === 'off-hand') {
      characters[viewIndex].equipments.offHandId = ''
      if (this.isTwoHands('', item)) characters[viewIndex].equipments.mainHandId = '';
    };
    if (bodyPart === 'chest') characters[viewIndex].equipments.chestId = '';
    if (bodyPart === 'hands') characters[viewIndex].equipments.handsId = '';
    if (bodyPart === 'legs') characters[viewIndex].equipments.legsId = '';
    if (bodyPart === 'feet') characters[viewIndex].equipments.feetId = '';

    this.characterServ.calculateCharacterStats(characters[viewIndex]);
    this.characterServ.selectedCharacters.next(characters);
  }

  isTwoHands(id: string, item?: Item) {
    if (!item) {
      item = this.airtable.getItemById(id);
    }
    if (item && item.tags) {
      return item.tags.find(t => t == '2 Hands' || t == '2 hands' || t == '2Hands' || t == '2hands' || t == '2 Hand' || t == '2 hand');
    } else {
      return '';
    }
  }

  onRemoveTrinket(index: number) {
    const characters = this.characterServ.selectedCharacters.getValue();
    const viewIndex = this.characterServ.viewIndex;
    characters[viewIndex].equipments.backPack.push(characters[viewIndex].equipments.trinketsId[index]);
    characters[viewIndex].equipments.trinketsId.splice(index, 1);

    this.characterServ.calculateCharacterStats(characters[viewIndex]);
    this.characterServ.selectedCharacters.next(characters);
  }

  async onRemoveBackpack(index: number) {
    const modal = await this.modalController.create({
      component: ConfirmSelectionComponent,
      componentProps: {
        'headerTxt': 'Remove Item Permanently?',
        'bodyTxt': `This will permanently remove this item from your backpack`,
        'confirmBtnTxt': 'Remove',
      }
    });
    modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data.isConfirm) {
      this.characterServ.selectedCharacters.getValue()[this.characterServ.viewIndex].equipments.backPack.splice(index, 1);
    }
  }

  onAddNewEquipment(bodyProperty: string, hand?: 'main-hand' | 'off-hand' | 'backpack') {
    this.router.navigate(['/encyclopedia-tabs/items-list'], {
      replaceUrl: true,
      queryParams: {
        breadcrumb: '/character-tabs/equipment',
        bodyProperty: bodyProperty,
        isSelectType: 'all',
      }
    });
  }

  onEquipmentAddedToBackback(itemId) {
    this.characterServ.selectedCharacters.pipe(take(1)).subscribe((characters) => {
      characters[this.characterServ.viewIndex]
        .equipments.backPack.push(itemId);
      this.characterServ.selectedCharacters.next(characters);
      console.log('pushed new item to backpack for this charatcer', characters[this.characterServ.viewIndex]);
    });
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

  isShowEquipButton(itemId) {
    if (this.backPackSelection) {
      const item = this.airtable.getItemById(itemId);
      if (this.backPackSelection.bodyProperty.toLocaleLowerCase() == item.body_property.toLocaleLowerCase()) {
        return true;
      }
      if (this.backPackSelection.hand && this.backPackSelection.hand === 'main-hand' || this.backPackSelection.hand === 'off-hand') {
        return true;
      }
    } else {
      return false;
    }
  }

}

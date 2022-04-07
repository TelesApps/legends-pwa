import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CharacterCreationTabsPageRoutingModule } from './character-creation-tabs-routing.module';

import { CharacterCreationTabsPage } from './character-creation-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CharacterCreationTabsPageRoutingModule
  ],
  declarations: [CharacterCreationTabsPage]
})
export class CharacterCreationTabsPageModule {}

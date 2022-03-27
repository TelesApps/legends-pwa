import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CharacterTabsPageRoutingModule } from './character-tabs-routing.module';

import { CharacterTabsPage } from './character-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CharacterTabsPageRoutingModule
  ],
  declarations: [CharacterTabsPage]
})
export class CharacterTabsPageModule {}

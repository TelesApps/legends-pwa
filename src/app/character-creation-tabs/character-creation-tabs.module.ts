import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CharacterCreationTabsPageRoutingModule } from './character-creation-tabs-routing.module';

import { CharacterCreationTabsPage } from './character-creation-tabs.page';
import { ModalsModule } from '../modals/modals.module';
import { CharacterCreationService } from '../services/character-creation.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CharacterCreationTabsPageRoutingModule,
    ModalsModule,
  ],
  declarations: [CharacterCreationTabsPage],
  providers: [CharacterCreationService]
})
export class CharacterCreationTabsPageModule {}

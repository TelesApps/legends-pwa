import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CharacterTabsPageRoutingModule } from './character-tabs-routing.module';

import { CharacterTabsPage } from './character-tabs.page';
import { AbilitiesPageModule } from './abilities/abilities.module';
import { EquipmentPageModule } from './equipment/equipment.module';
import { MainPageModule } from './main/main.module';
import { PartyPageModule } from './party/party.module';
import { SkillsPageModule } from './skills/skills.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CharacterTabsPageRoutingModule,
    AbilitiesPageModule,
    EquipmentPageModule,
    MainPageModule,
    PartyPageModule,
    SkillsPageModule,
  ],
  declarations: [CharacterTabsPage]
})
export class CharacterTabsPageModule {}

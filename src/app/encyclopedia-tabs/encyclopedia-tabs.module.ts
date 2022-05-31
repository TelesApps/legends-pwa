import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncyclopediaTabsPageRoutingModule } from './encyclopedia-tabs-routing.module';

import { EncyclopediaTabsPage } from './encyclopedia-tabs.page';
import { AbilitiesListPageModule } from './abilities-list/abilities-list.module';
import { ItemsListPageModule } from './items-list/items-list.module';
import { LorePageModule } from './lore/lore.module';
import { RulesPageModule } from './rules/rules.module';
import { SkillsTraitsListPageModule } from './skills-traits-list/skills-traits-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncyclopediaTabsPageRoutingModule,
    AbilitiesListPageModule,
    ItemsListPageModule,
    LorePageModule,
    RulesPageModule,
    SkillsTraitsListPageModule
  ],
  declarations: [EncyclopediaTabsPage]
})
export class EncyclopediaTabsPageModule {}

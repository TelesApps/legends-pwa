import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CharacterCreationTabsPageRoutingModule } from './character-creation-tabs-routing.module';

import { CharacterCreationTabsPage } from './character-creation-tabs.page';
import { ModalsModule } from '../modals/modals.module';
import { CharacterCreationService } from '../services/character-creation.service';
import { AbilitiesSelectionPageModule } from './abilities-selection/abilities-selection.module';
import { EquipmentSelectionPageModule } from './equipment-selection/equipment-selection.module';
import { ReviewPageModule } from './review/review.module';
import { SkillsSelectionPageModule } from './skills-selection/skills-selection.module';
import { StatsSelectionPageModule } from './stats-selection/stats-selection.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CharacterCreationTabsPageRoutingModule,
    ModalsModule,
    AbilitiesSelectionPageModule,
    EquipmentSelectionPageModule,
    ReviewPageModule,
    SkillsSelectionPageModule,
    StatsSelectionPageModule
  ],
  declarations: [CharacterCreationTabsPage],
  providers: [CharacterCreationService]
})
export class CharacterCreationTabsPageModule {}

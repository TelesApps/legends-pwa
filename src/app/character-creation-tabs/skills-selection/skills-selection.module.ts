import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SkillsSelectionPageRoutingModule } from './skills-selection-routing.module';

import { SkillsSelectionPage } from './skills-selection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SkillsSelectionPageRoutingModule
  ],
  declarations: [SkillsSelectionPage]
})
export class SkillsSelectionPageModule {}

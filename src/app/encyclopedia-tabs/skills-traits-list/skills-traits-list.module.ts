import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SkillsTraitsListPageRoutingModule } from './skills-traits-list-routing.module';

import { SkillsTraitsListPage } from './skills-traits-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SkillsTraitsListPageRoutingModule
  ],
  declarations: [SkillsTraitsListPage]
})
export class SkillsTraitsListPageModule {}

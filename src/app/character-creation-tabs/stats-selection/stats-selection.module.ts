import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatsSelectionPageRoutingModule } from './stats-selection-routing.module';

import { StatsSelectionPage } from './stats-selection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatsSelectionPageRoutingModule
  ],
  declarations: [StatsSelectionPage]
})
export class StatsSelectionPageModule {}

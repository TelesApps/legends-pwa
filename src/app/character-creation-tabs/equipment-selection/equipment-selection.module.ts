import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EquipmentSelectionPageRoutingModule } from './equipment-selection-routing.module';

import { EquipmentSelectionPage } from './equipment-selection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EquipmentSelectionPageRoutingModule
  ],
  declarations: [EquipmentSelectionPage]
})
export class EquipmentSelectionPageModule {}

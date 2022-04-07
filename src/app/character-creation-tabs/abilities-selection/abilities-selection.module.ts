import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AbilitiesSelectionPageRoutingModule } from './abilities-selection-routing.module';

import { AbilitiesSelectionPage } from './abilities-selection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AbilitiesSelectionPageRoutingModule
  ],
  declarations: [AbilitiesSelectionPage]
})
export class AbilitiesSelectionPageModule {}

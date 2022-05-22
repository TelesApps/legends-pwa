import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AbilitiesListPageRoutingModule } from './abilities-list-routing.module';

import { AbilitiesListPage } from './abilities-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AbilitiesListPageRoutingModule
  ],
  declarations: [AbilitiesListPage]
})
export class AbilitiesListPageModule {}

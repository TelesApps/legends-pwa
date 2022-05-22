import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncyclopediaTabsPageRoutingModule } from './encyclopedia-tabs-routing.module';

import { EncyclopediaTabsPage } from './encyclopedia-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncyclopediaTabsPageRoutingModule
  ],
  declarations: [EncyclopediaTabsPage]
})
export class EncyclopediaTabsPageModule {}

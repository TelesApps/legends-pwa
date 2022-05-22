import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LorePageRoutingModule } from './lore-routing.module';

import { LorePage } from './lore.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LorePageRoutingModule
  ],
  declarations: [LorePage]
})
export class LorePageModule {}

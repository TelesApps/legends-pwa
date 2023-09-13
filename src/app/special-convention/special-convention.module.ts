import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpecialConventionPageRoutingModule } from './special-convention-routing.module';

import { SpecialConventionPage } from './special-convention.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpecialConventionPageRoutingModule
  ],
  declarations: [SpecialConventionPage]
})
export class SpecialConventionPageModule {}

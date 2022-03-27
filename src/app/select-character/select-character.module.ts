import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectCharacterPageRoutingModule } from './select-character-routing.module';

import { SelectCharacterPage } from './select-character.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectCharacterPageRoutingModule
  ],
  declarations: [SelectCharacterPage]
})
export class SelectCharacterPageModule {}

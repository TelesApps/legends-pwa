import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainLobbyPageRoutingModule } from './main-lobby-routing.module';

import { MainLobbyPage } from './main-lobby.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainLobbyPageRoutingModule
  ],
  declarations: [MainLobbyPage]
})
export class MainLobbyPageModule {}

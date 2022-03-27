import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainLobbyPage } from './main-lobby.page';

const routes: Routes = [
  {
    path: '',
    component: MainLobbyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainLobbyPageRoutingModule {}

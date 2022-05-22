import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AbilitiesListPage } from './abilities-list.page';

const routes: Routes = [
  {
    path: '',
    component: AbilitiesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbilitiesListPageRoutingModule {}

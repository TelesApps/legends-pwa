import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatsSelectionPage } from './stats-selection.page';

const routes: Routes = [
  {
    path: '',
    component: StatsSelectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatsSelectionPageRoutingModule {}

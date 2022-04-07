import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EquipmentSelectionPage } from './equipment-selection.page';

const routes: Routes = [
  {
    path: '',
    component: EquipmentSelectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentSelectionPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpecialConventionPage } from './special-convention.page';

const routes: Routes = [
  {
    path: '',
    component: SpecialConventionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpecialConventionPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SkillsTraitsListPage } from './skills-traits-list.page';

const routes: Routes = [
  {
    path: '',
    component: SkillsTraitsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SkillsTraitsListPageRoutingModule {}

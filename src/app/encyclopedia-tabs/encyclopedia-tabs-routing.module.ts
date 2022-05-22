import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EncyclopediaTabsPage } from './encyclopedia-tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/encyclopedia-tabs/abilities-list',
    pathMatch: 'full'
  },
  {
    path: '',
    component: EncyclopediaTabsPage,
    children: [
      {
        path: 'abilities-list',
        loadChildren: () => import('./abilities-list/abilities-list.module').then(m => m.AbilitiesListPageModule)
      },
      // {
      //   path: 'equipment-selection',
      //   loadChildren: () => import('./equipment-selection/equipment-selection.module').then(m => m.EquipmentSelectionPageModule)
      // },
      // {
      //   path: 'abilities-selection',
      //   loadChildren: () => import('./abilities-selection/abilities-selection.module').then(m => m.AbilitiesSelectionPageModule)
      // },
      // {
      //   path: 'skills-selection',
      //   loadChildren: () => import('./skills-selection/skills-selection.module').then(m => m.SkillsSelectionPageModule)
      // },
      // {
      //   path: 'review',
      //   loadChildren: () => import('./review/review.module').then( m => m.ReviewPageModule)
      // },
    ]
  },
  {
    path: 'abilities-list',
    loadChildren: () => import('./abilities-list/abilities-list.module').then( m => m.AbilitiesListPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EncyclopediaTabsPageRoutingModule {}

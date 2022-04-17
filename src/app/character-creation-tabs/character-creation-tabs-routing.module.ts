import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CharacterCreationTabsPage } from './character-creation-tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/character-creation-tabs/stats-selection',
    pathMatch: 'full'
  },
  {
    path: '',
    component: CharacterCreationTabsPage,
    children: [
      {
        path: 'stats-selection',
        loadChildren: () => import('./stats-selection/stats-selection.module').then(m => m.StatsSelectionPageModule)
      },
      {
        path: 'equipment-selection',
        loadChildren: () => import('./equipment-selection/equipment-selection.module').then(m => m.EquipmentSelectionPageModule)
      },
      {
        path: 'skills-selection',
        loadChildren: () => import('./skills-selection/skills-selection.module').then(m => m.SkillsSelectionPageModule)
      },
      {
        path: 'abilities-selection',
        loadChildren: () => import('./abilities-selection/abilities-selection.module').then(m => m.AbilitiesSelectionPageModule)
      },
      {
        path: 'review',
        loadChildren: () => import('./review/review.module').then( m => m.ReviewPageModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CharacterCreationTabsPageRoutingModule { }

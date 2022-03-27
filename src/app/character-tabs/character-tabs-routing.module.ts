import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CharacterTabsPage } from './character-tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/character-tabs/main',
    pathMatch: 'full'
  },
  {
    path: '',
    component: CharacterTabsPage,
    children: [
      {
        path: 'main',
        loadChildren: () => import('./main/main.module').then(m => m.MainPageModule)
      },
      {
        path: 'equipment',
        loadChildren: () => import('./equipment/equipment.module').then(m => m.EquipmentPageModule)
      },
      {
        path: 'skills',
        loadChildren: () => import('./skills/skills.module').then( m => m.SkillsPageModule)
      },
      {
        path: 'party',
        loadChildren: () => import('./party/party.module').then( m => m.PartyPageModule)
      },
      {
        path: 'abilities',
        loadChildren: () => import('./abilities/abilities.module').then( m => m.AbilitiesPageModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CharacterTabsPageRoutingModule { }

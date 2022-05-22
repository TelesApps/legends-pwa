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
      {
        path: 'items-list',
        loadChildren: () => import('./items-list/items-list-routing.module').then(m => m.ItemsListPageRoutingModule)
      },
      {
        path: 'skills-traits-list',
        loadChildren: () => import('./skills-traits-list/skills-traits-list-routing.module').then(m => m.SkillsTraitsListPageRoutingModule)
      },
      {
        path: 'rules',
        loadChildren: () => import('./rules/rules-routing.module').then(m => m.RulesPageRoutingModule)
      },
      {
        path: 'lore',
        loadChildren: () => import('./lore/lore-routing.module').then( m => m.LorePageRoutingModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EncyclopediaTabsPageRoutingModule {}

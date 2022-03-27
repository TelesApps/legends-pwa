import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'character-tabs',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'character-tabs',
    loadChildren: () => import('./character-tabs/character-tabs.module').then( m => m.CharacterTabsPageModule)
  },
  {
    path: 'main-lobby',
    loadChildren: () => import('./main-lobby/main-lobby.module').then( m => m.MainLobbyPageModule)
  },
  {
    path: 'my-profile',
    loadChildren: () => import('./my-profile/my-profile.module').then( m => m.MyProfilePageModule)
  },
  {
    path: 'select-character',
    loadChildren: () => import('./select-character/select-character.module').then( m => m.SelectCharacterPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

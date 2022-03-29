import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

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
    loadChildren: () => import('./character-tabs/character-tabs.module').then( m => m.CharacterTabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'main-lobby',
    loadChildren: () => import('./main-lobby/main-lobby.module').then( m => m.MainLobbyPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'my-profile',
    loadChildren: () => import('./my-profile/my-profile.module').then( m => m.MyProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'select-character',
    loadChildren: () => import('./select-character/select-character.module').then( m => m.SelectCharacterPageModule),
    canActivate: [AuthGuard]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {PrivateGuard} from './guards/private.guard';
import {PublicGuard} from './guards/public.guard';

const routes: Routes = [
  {
    path: '',
    canMatch: [PublicGuard],
    loadComponent: () => import('./pages/start/start-page.component').then(chunk => chunk.StartPageComponent),
  },
  {
    path: '',
    canMatch: [PrivateGuard],
    loadChildren: () => import('./modules/game/game.module').then(chunk => chunk.GameModule),
  },
  {
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

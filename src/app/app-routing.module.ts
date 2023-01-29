import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {GameGuard} from './guards/game.guard';
import {StartGuard} from './guards/start.guard';

const routes: Routes = [
  {
    path: '',
    canMatch: [StartGuard],
    loadComponent: () => import('./pages/start/start-page.component').then(chunk => chunk.StartPageComponent),
  },
  {
    path: '',
    canMatch: [GameGuard],
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

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {GameComponent} from './game.component';

const routes: Routes = [
  {
    path: '',
    component: GameComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'menu',
      },
      {
        path: 'menu',
        loadComponent: () => import('../../pages/menu/menu-page.component').then(chunk => chunk.MenuPageComponent),
      },
      {
        path: 'hero',
        loadComponent: () => import('../../pages/hero/hero-page.component').then(chunk => chunk.HeroPageComponent),
      },
      {
        path: 'vs-game',
        loadComponent: () =>
          import('../../pages/vs-game/vs-game-page.component').then(chunk => chunk.VsGamePageComponent),
      },
      {
        path: 'game',
        loadComponent: () => import('../../pages/game/game-page.component').then(chunk => chunk.GamePageComponent),
      },
      {
        path: 'top',
        loadComponent: () => import('../../pages/top/top-page.component').then(chunk => chunk.TopPageComponent),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameRoutingModule {}

import {NgModule} from '@angular/core';
import {WrapRouterOutletComponent} from 'src/app/components/wrap-router-outlet/wrap-router-outlet.component';

import {GameRoutingModule} from './game-routing.module';
import {GameComponent} from './game.component';

@NgModule({
  declarations: [GameComponent],
  imports: [GameRoutingModule, WrapRouterOutletComponent],
})
export class GameModule {}

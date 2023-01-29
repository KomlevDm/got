import {Component, ChangeDetectionStrategy} from '@angular/core';

import {SIZES} from '../../consts/sizes.const';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {
  protected readonly width = SIZES.WIDTH;
  protected readonly height = SIZES.HEIGHT;
}

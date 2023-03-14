import {Component, ChangeDetectionStrategy, Input, HostBinding} from '@angular/core';

import {SIZES} from '../../../consts/sizes.const';

@Component({
  standalone: true,
  selector: 'bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarComponent {
  @Input()
  public heroName = '';

  @Input()
  public heroLifePct = 100;

  @Input()
  public heroAttacks = 0;

  @Input()
  public opponentLifePct = 100;

  @Input()
  public opponentName = '';

  protected get heroBarTransformCss(): string {
    return 'translateX(' + (this.heroLifePct - 100) + '%)';
  }

  protected get opponentBarTransformCss(): string {
    return 'translateX(' + (100 - this.opponentLifePct) + '%)';
  }

  @HostBinding('style.height.px')
  private readonly height = SIZES.Y.MIN;
}

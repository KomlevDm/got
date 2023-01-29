import {NgIf} from '@angular/common';
import {Component, ChangeDetectionStrategy, Input, HostBinding} from '@angular/core';

import {SIZES} from '../../../consts/sizes.const';

@Component({
  standalone: true,
  imports: [NgIf],
  selector: 'bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarComponent {
  @Input()
  public lives = 0;

  @Input()
  public isShieldActivated = false;

  @Input()
  public isPunchActivated = false;

  @Input()
  public isLightningActivated = false;

  @Input()
  public heroName = '';

  @Input()
  public hasBoss = false;

  @Input()
  public bossLifePct = 100;

  @Input()
  public score = 0;

  protected get bossBarTransformCss(): string {
    return 'translateX(' + (this.bossLifePct - 100) + '%)';
  }

  @HostBinding('style.height.px')
  private readonly height = SIZES.Y.MIN;
}

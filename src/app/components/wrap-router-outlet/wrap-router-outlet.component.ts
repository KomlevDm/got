import {transition, trigger, query, style, animate} from '@angular/animations';
import {NgIf} from '@angular/common';
import {Component, ChangeDetectionStrategy, ViewChild, HostBinding, HostListener, Input} from '@angular/core';
import {ActivatedRoute, RouterModule, RouterOutlet} from '@angular/router';

import {SpinnerComponent} from '../spinner/spinner.component';

@Component({
  standalone: true,
  imports: [NgIf, RouterModule, SpinnerComponent],
  selector: 'wrap-router-outlet',
  templateUrl: './wrap-router-outlet.component.html',
  styleUrls: ['./wrap-router-outlet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('routeAnimation', [
      transition('* <=> *', [
        query(':leave', [style({opacity: 1}), animate('0.2s', style({opacity: 0}))], {optional: true}),
        query(':enter', [style({opacity: 0}), animate('0.2s', style({opacity: 1}))], {optional: true}),
      ]),
    ]),
  ],
})
export class WrapRouterOutletComponent {
  @Input()
  public isUseSpinner = true;

  protected isShowSpinner = false;

  @ViewChild(RouterOutlet, {static: true})
  private readonly routerOutlet!: RouterOutlet;

  @HostBinding('@routeAnimation')
  private get routerOutletActivated(): false | ActivatedRoute {
    return this.routerOutlet.isActivated && this.routerOutlet.activatedRoute;
  }

  @HostListener('@routeAnimation.start')
  private routeAnimationStart(): void {
    this.isShowSpinner = true;
  }

  @HostListener('@routeAnimation.done')
  private routeAnimationEnd(): void {
    this.isShowSpinner = false;
  }
}

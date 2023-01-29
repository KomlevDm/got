import {Directive, EventEmitter, HostBinding, HostListener, Input, Output} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[decrease]',
})
export class DecreaseDirective {
  @Input()
  public transitionDurationMs = 200;

  @Output()
  public readonly startedDecrease = new EventEmitter<void>();

  @Output()
  public readonly endedDecrease = new EventEmitter<void>();

  private isDecrease = false;

  @HostBinding('style.transform')
  private get transform(): string {
    return `scale(${this.isDecrease ? 0 : 1})`;
  }

  @HostBinding('style.transition')
  private get transition(): string {
    return `transform ${this.transitionDurationMs}ms linear`;
  }

  @HostListener('click')
  private onClick(): void {
    this.isDecrease = true;
  }

  @HostListener('transitionstart')
  private onTransitionStart(): void {
    this.startedDecrease.next();
  }

  @HostListener('transitionend')
  private onTransitionEnd(): void {
    this.endedDecrease.next();
  }
}

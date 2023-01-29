import {Directive, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

@Directive()
export abstract class ADestroyer implements OnDestroy {
  protected readonly destroyer$ = new Subject<void>();

  public ngOnDestroy(): void {
    this.destroyer$.next();
    this.destroyer$.complete();
  }
}

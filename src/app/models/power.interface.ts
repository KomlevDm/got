import {BehaviorSubject} from 'rxjs';

export interface IPower {
  isActivated$: BehaviorSubject<boolean>;
  lifetimeMs: number;
}

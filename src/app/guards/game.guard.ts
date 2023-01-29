import {Injectable} from '@angular/core';
import {CanMatch} from '@angular/router';

import {BootstrapService} from '../services/bootstrap.service';

@Injectable({providedIn: 'root'})
export class GameGuard implements CanMatch {
  constructor(private readonly bootstrapService: BootstrapService) {}

  public canMatch(): boolean {
    if (!this.bootstrapService.isGameActivated) {
      return false;
    }

    return true;
  }
}

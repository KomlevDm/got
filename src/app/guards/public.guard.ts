import {inject} from '@angular/core';
import {CanMatchFn} from '@angular/router';

import {BootstrapService} from '../services/bootstrap.service';

export const PublicGuard: CanMatchFn = () => {
  const bootstrapService = inject(BootstrapService);

  if (bootstrapService.isGameActivated) {
    return false;
  }

  return true;
};

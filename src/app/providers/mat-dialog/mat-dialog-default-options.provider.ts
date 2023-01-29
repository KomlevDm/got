import {FactoryProvider} from '@angular/core';
import {MatDialogConfig, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';

export const MAT_DIALOG_DEFAULT_OPTIONS_PROVIDER: FactoryProvider = {
  provide: MAT_DIALOG_DEFAULT_OPTIONS,
  useFactory: (): MatDialogConfig => {
    return {
      autoFocus: false,
      hasBackdrop: true,
      closeOnNavigation: true,
      restoreFocus: true,
    };
  },
};

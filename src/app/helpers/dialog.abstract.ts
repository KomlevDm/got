import {Directive, OnInit, inject} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {takeUntil} from 'rxjs';

import {ADestroyer} from './destroyer.abstract';
import {AudioService} from '../services/audio.service';

@Directive()
export abstract class ADialog extends ADestroyer implements OnInit {
  protected readonly audioService = inject(AudioService);
  protected readonly self = inject(MatDialogRef);

  public ngOnInit(): void {
    this.self
      .afterOpened()
      .pipe(takeUntil(this.destroyer$))
      .subscribe(() => this.audioService.openDialog.replay());

    this.self
      .beforeClosed()
      .pipe(takeUntil(this.destroyer$))
      .subscribe(() => this.audioService.closeDialog.replay());
  }
}

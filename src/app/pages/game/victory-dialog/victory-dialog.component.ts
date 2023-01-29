import {Component, ChangeDetectionStrategy, HostBinding, OnInit} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {takeUntil} from 'rxjs';

import {ButtonComponent} from '../../../components/button/button.component';
import {ADialog} from '../../../helpers/dialog.abstract';
import {GameService} from '../../../services/game.service';

@Component({
  standalone: true,
  imports: [MatDialogModule, TranslateModule, ButtonComponent],
  selector: 'victory-dialog',
  templateUrl: './victory-dialog.component.html',
  styleUrls: ['./victory-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VictoryDialogComponent extends ADialog implements OnInit {
  @HostBinding('class.dialog')
  private readonly isDialog = true;

  constructor(private readonly router: Router, protected readonly gameService: GameService) {
    super();
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.self
      .afterOpened()
      .pipe(takeUntil(this.destroyer$))
      .subscribe(() => {
        this.gameService.pause();

        void this.audioService.victory.replay();
      });
  }

  protected top(): void {
    void this.audioService.routing.replay();
    void this.router.navigateByUrl('/top');
  }
}

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
  selector: 'game-dialog',
  templateUrl: './game-dialog.component.html',
  styleUrls: ['./game-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameDialogComponent extends ADialog implements OnInit {
  @HostBinding('class.dialog')
  private readonly isDialog = true;

  constructor(private readonly router: Router, private readonly gameService: GameService) {
    super();
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.self
      .afterOpened()
      .pipe(takeUntil(this.destroyer$))
      .subscribe(() => this.gameService.pause());

    this.self
      .beforeClosed()
      .pipe(takeUntil(this.destroyer$))
      .subscribe(() => this.gameService.continue());
  }

  protected finish(): void {
    void this.audioService.routing.replay();
    void this.router.navigateByUrl('/menu');
  }
}

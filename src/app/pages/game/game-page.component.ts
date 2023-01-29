import {
  Component,
  OnDestroy,
  ChangeDetectionStrategy,
  AfterViewInit,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import * as _ from 'lodash-es';
import {takeUntil} from 'rxjs';

import {BarComponent} from './bar/bar.component';
import {GameDialogComponent} from './game-dialog/game-dialog.component';
import {GameOverDialogComponent} from './game-over-dialog/game-over-dialog.component';
import {VictoryDialogComponent} from './victory-dialog/victory-dialog.component';
import {ADestroyer} from '../../helpers/destroyer.abstract';
import {ELocalStorageKey} from '../../models/local-storage-key.enum';
import {ITopRow} from '../../models/top-row.interface';
import {BossService} from '../../services/boss.service';
import {GameService} from '../../services/game.service';
import {HeroService} from '../../services/hero.service';

@Component({
  standalone: true,
  imports: [BarComponent],
  selector: 'game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePageComponent extends ADestroyer implements OnInit, AfterViewInit, OnDestroy {
  protected readonly heroName: string;
  protected lives = 0;
  protected isShieldActivated = false;
  protected isPunchActivated = false;
  protected isLightningActivated = false;
  protected hasBoss = false;
  protected bossLifePct = 0;
  protected score = 0;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly cdr: ChangeDetectorRef,
    private readonly matDialog: MatDialog,
    private readonly gameService: GameService,
    private readonly heroService: HeroService,
    private readonly bossService: BossService,
  ) {
    super();

    this.heroName = heroService.name;
  }

  public ngOnInit(): void {
    this.heroService.lives$.pipe(takeUntil(this.destroyer$)).subscribe(lives => {
      this.lives = lives;
      this.cdr.detectChanges();

      if (!lives) {
        this.matDialog.open(GameOverDialogComponent, {disableClose: true});
      }
    });

    this.heroService.isShieldActivated$.pipe(takeUntil(this.destroyer$)).subscribe(isShieldActivated => {
      this.isShieldActivated = isShieldActivated;
      this.cdr.detectChanges();
    });

    this.heroService.isPunchActivated$.pipe(takeUntil(this.destroyer$)).subscribe(isPunchActivated => {
      this.isPunchActivated = isPunchActivated;
      this.cdr.detectChanges();
    });

    this.heroService.isLightningActivated$.pipe(takeUntil(this.destroyer$)).subscribe(isLightningActivated => {
      this.isLightningActivated = isLightningActivated;
      this.cdr.detectChanges();
    });

    this.bossService.hasBoss$.pipe(takeUntil(this.destroyer$)).subscribe(hasBoss => {
      this.hasBoss = hasBoss;
      this.cdr.detectChanges();
    });

    this.bossService.livesPct$.pipe(takeUntil(this.destroyer$)).subscribe(livesPct => {
      this.bossLifePct = livesPct;
      this.cdr.detectChanges();

      if (!livesPct) {
        const topRaw = localStorage.getItem(ELocalStorageKey.Top);
        const top: ITopRow[] = topRaw !== null ? JSON.parse(topRaw) : [];
        const newTop = _.take(top.concat({name: this.heroService.name, score: this.heroService.score}), 10).sort(
          (a, b) => b.score - a.score,
        );
        localStorage.setItem(ELocalStorageKey.Top, JSON.stringify(newTop));

        this.matDialog.open(VictoryDialogComponent, {disableClose: true});
      }
    });

    this.heroService.score$.pipe(takeUntil(this.destroyer$)).subscribe(score => {
      this.score = score;
      this.cdr.detectChanges();
    });
  }

  public ngAfterViewInit(): void {
    this.gameService.start(this.elementRef.nativeElement);
  }

  public override ngOnDestroy(): void {
    this.gameService.finish();
    super.ngOnDestroy();
  }

  @HostListener('document:keydown.esc')
  protected openGameDialog(): void {
    if (this.matDialog.openDialogs.length) {
      return;
    }

    this.matDialog.open(GameDialogComponent);
  }
}

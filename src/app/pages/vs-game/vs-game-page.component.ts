import {NgIf} from '@angular/common';
import {
  Component,
  OnDestroy,
  ChangeDetectionStrategy,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import {fromEvent, of, switchMap, takeUntil} from 'rxjs';
import {io, Socket} from 'socket.io-client';

import {BarComponent} from './bar/bar.component';
import {OpponentSearchComponent} from './opponent-search/opponent-search.component';
import {IServerEvents} from '../../../../shared-models/server-events.interface';
import {env} from '../../../envs/env';
import {ADestroyer} from '../../helpers/destroyer.abstract';
import {BootstrapService} from '../../services/bootstrap.service';
import {OpponentService} from '../../services/vs-game/opponent.service';
import {VsGameService} from '../../services/vs-game/vs-game.service';
import {VsHeroService} from '../../services/vs-game/vs-hero.service';

@Component({
  standalone: true,
  imports: [NgIf, OpponentSearchComponent, BarComponent],
  selector: 'vs-game-page',
  templateUrl: './vs-game-page.component.html',
  styleUrls: ['./vs-game-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VsGamePageComponent extends ADestroyer implements OnInit, AfterViewInit, OnDestroy {
  protected readonly heroName: string;
  protected heroLifePct = 100;
  protected heroAttacks = 0;
  protected opponentName = '?';
  protected opponentLifePct = 100;
  protected isOpponentSearch = false;

  private socket: Socket | null = null;

  constructor(
    private readonly bootstrapService: BootstrapService, // TODO:
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly cdr: ChangeDetectorRef,
    private readonly vsGameService: VsGameService,
    private readonly vsHeroService: VsHeroService,
    private readonly opponentService: OpponentService,
  ) {
    super();

    this.heroName = vsHeroService.name;
  }

  public ngOnInit(): void {
    this.socket = io(env.apiUrl + '/vs-game');

    const socket$ = of(io(env.apiUrl + '/vs-game'));

    socket$.pipe(switchMap(socket => fromEvent(socket, 'connect'))).subscribe((...a) => {
      debugger; // TODO:
    });

    this.socket.on<IServerEvents['opponentFound']['event']>(
      'opponentFound',
      (data: IServerEvents['opponentFound']['data']) => {
        this.isOpponentSearch = false;
        this.opponentName = data.name;

        this.cdr.detectChanges();
      },
    );

    this.socket.on('opponentLoss', () => {
      this.isOpponentSearch = true;
      this.cdr.detectChanges();
    });

    this.vsHeroService.lifePct$.pipe(takeUntil(this.destroyer$)).subscribe(lifePct => {
      this.heroLifePct = lifePct;
      this.cdr.detectChanges();
    });

    this.vsHeroService.attacks$.pipe(takeUntil(this.destroyer$)).subscribe(attacks => {
      this.heroAttacks = attacks;
      this.cdr.detectChanges();
    });

    this.opponentService.lifePct$.pipe(takeUntil(this.destroyer$)).subscribe(lifePct => {
      this.opponentLifePct = lifePct;
      this.cdr.detectChanges();
    });
  }

  public async ngAfterViewInit(): Promise<void> {
    if (!this.socket) {
      return;
    }

    await this.bootstrapService.bootstrap(); // TODO:

    this.vsGameService.start(this.elementRef.nativeElement, this.socket);

    this.isOpponentSearch = true;
    this.cdr.detectChanges();
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}

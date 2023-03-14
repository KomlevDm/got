import {Injectable} from '@angular/core';
import {AnimatedSprite, Application} from 'pixi.js';
import {Observable, BehaviorSubject, map} from 'rxjs';
import {Socket} from 'socket.io-client';

import {SIZES} from '../../consts/sizes.const';
import {AssetsService} from '../assets.service';
import {AttacksService} from '../attacks.service';

const SETTINGS = {
  LIVES: 50,
} as const;

@Injectable({providedIn: 'root'})
export class OpponentService {
  public readonly lifePct$: Observable<number>;
  public name = '-';
  public sprite: AnimatedSprite | null = null;

  public set lives(value: number) {
    this._lives$.next(value);
  }
  public get lives(): number {
    return this._lives$.value;
  }

  private readonly _lives$ = new BehaviorSubject<number>(SETTINGS.LIVES);

  constructor(private readonly assetsService: AssetsService, private readonly attacksService: AttacksService) {
    this.lifePct$ = this._lives$.asObservable().pipe(map(lives => (lives / SETTINGS.LIVES) * 100));
  }

  public start(game: Application, socket: Socket): void {
    socket.on('opponentFound', (data: any) => {
      this.name = data.name;

      this.sprite = new AnimatedSprite(this.assetsService.opponent.animations['self']);
      this.sprite.scale.set(-0.32, 0.32);
      this.sprite.anchor.set(0.5);
      this.sprite.animationSpeed = 0.4;
      this.sprite.position.set(SIZES.X.VS_OPPONENT - SIZES.X.DELTA(this.sprite), SIZES.Y.MID);
      this.sprite.play();

      game.stage.addChild(this.sprite);
    });

    socket.on('opponentLoss', () => {
      this.sprite?.destroy();
      this.sprite = null;
    });

    socket.on('tick', (data: {y?: number; attackOpts?: any}) => {
      if (!this.sprite) {
        return;
      }

      this.sprite.y = data.y ?? this.sprite.y;

      if (data.attackOpts) {
        this.attacksService.addOne({
          ...data.attackOpts,
          texture: this.assetsService.attacks['attack-4'],
          x: this.sprite.x - SIZES.X.DELTA(this.sprite),
          y: this.sprite.y,
          whose: 'monster',
        });
      }
    });
  }
}

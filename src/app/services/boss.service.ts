import {Injectable, OnDestroy} from '@angular/core';
import * as _ from 'lodash-es';
import {AnimatedSprite, Application, Ticker} from 'pixi.js';
import {Observable, BehaviorSubject, map} from 'rxjs';

import {AssetsService} from './assets.service';
import {AttacksService} from './attacks.service';
import {BgService} from './bg.service';
import {HeroService} from './hero.service';
import {MonstersService} from './monsters.service';
import {SIZES} from '../consts/sizes.const';
import {yRandomMotion} from '../helpers/y-random-motion.function';
import {IYMotion} from '../models/y-motion.interface';
import {TYRender} from '../models/y-render.type';

const SETTINGS = {
  LIVES: 50,
  SPEED: {
    X: 1,
    Y: BgService.SPEED + 5,
  },
  ATTACK: {
    MIN_INTERVAL_S: 1,
    MAX_INTERVAL_S: 2,
    SPEED: BgService.SPEED + 10,
    SCALE: 0.23,
    SCALE_SPEED: 0.018,
    ROTATION_ANGLE_DEG: 12,
    Y_DELTA: 30,
  },
  PUNCH_MAX_ARC_COEF: 1000,
  GENERATION_HERO_SCORE: {
    MIN: 10_000,
    MAX: 15_000,
  },
} as const;

@Injectable({providedIn: 'root'})
export class BossService implements OnDestroy {
  public readonly lifePct$: Observable<number>;
  public readonly hasBoss$: Observable<boolean>;
  public sprite: AnimatedSprite | null = null;

  public set lives(value: number) {
    this._lives$.next(value);
  }
  public get lives(): number {
    return this._lives$.value;
  }

  public get canUseMnemoShield(): boolean {
    return _.random(4) === 2;
  }

  public get canUsePunch(): boolean {
    return _.random(10) === 5;
  }

  private readonly _lives$ = new BehaviorSubject<number>(SETTINGS.LIVES);
  private readonly _hasBoss$ = new BehaviorSubject(false);
  private readonly yMotion: IYMotion = {min: 0, max: SIZES.HEIGHT, canChange: false, dir: 1};
  private game: Application | null = null;
  private generationHeroScore: number = SETTINGS.GENERATION_HERO_SCORE.MAX;
  private attackTime = SETTINGS.ATTACK.MIN_INTERVAL_S * 1000;

  private get canCreate(): boolean {
    return !this._hasBoss$.value && this.heroService.score >= this.generationHeroScore;
  }

  constructor(
    private readonly assetsService: AssetsService,
    private readonly heroService: HeroService,
    private readonly monsterService: MonstersService,
    private readonly attacksService: AttacksService,
  ) {
    this.lifePct$ = this._lives$.asObservable().pipe(map(lives => (lives / SETTINGS.LIVES) * 100));
    this.hasBoss$ = this._hasBoss$.asObservable();
  }

  public start(game: Application): void {
    this.game = game;
    this.game.ticker.add(this.render);

    this.generationHeroScore = _.random(SETTINGS.GENERATION_HERO_SCORE.MIN, SETTINGS.GENERATION_HERO_SCORE.MAX);
  }

  public ngOnDestroy(): void {
    if (!this.game) {
      return;
    }

    this.game.ticker.remove(this.render);

    this.game = null;
    this.sprite = null;
    this.lives = SETTINGS.LIVES;
    this._hasBoss$.next(false);
  }

  private readonly render = (delta: number): void => {
    if (this.canCreate) {
      this.create();
    }

    this.xRender(delta);
    this.yRender(delta);

    this.attackRender(delta);
  };

  private create(): void {
    if (!this.game) {
      return;
    }

    this.sprite = new AnimatedSprite(this.assetsService.boss.animations['self']);
    this.sprite.scale.set(-0.35, 0.35);
    this.sprite.anchor.set(0.5);
    this.sprite.animationSpeed = 0.4;
    this.sprite.position.set(SIZES.X.BOSS.CREATE, SIZES.Y.MID);
    this.sprite.play();

    this.game.stage.addChild(this.sprite);

    const yDelta = SIZES.Y.DELTA(this.sprite);
    this.yMotion.min = SIZES.Y.MIN + yDelta;
    this.yMotion.max = SIZES.HEIGHT - yDelta;

    this.monsterService.hasBoss = true;

    this._hasBoss$.next(true);
  }

  private xRender(delta: number): void {
    if (!this.sprite) {
      return;
    }

    if (this.sprite.x > SIZES.X.BOSS.LIFE - SIZES.X.DELTA(this.sprite)) {
      this.sprite.x -= delta * SETTINGS.SPEED.X;
    }
  }

  private yRender(delta: number): void {
    if (!this.sprite) {
      return;
    }

    yRandomMotion({
      sprite: this.sprite,
      delta,
      speed: SETTINGS.SPEED.Y,
      yMotion: this.yMotion,
      random: {scope: 50, sample: 25},
    });
  }

  private attackRender(delta: number): void {
    if (this.attackTime <= 0) {
      if (this.canUsePunch) {
        this.addPunch();
      } else {
        this.addAttack();
      }

      this.attackTime = _.random(SETTINGS.ATTACK.MIN_INTERVAL_S, SETTINGS.ATTACK.MAX_INTERVAL_S) * 1000;
    } else {
      this.attackTime -= delta * Ticker.shared.deltaMS;
    }
  }

  private addAttack(yRender?: TYRender): void {
    if (!this.sprite) {
      return;
    }

    this.attacksService.addOne({
      texture: _.sample(this.assetsService.attacks)!,
      x: this.sprite.x - SIZES.X.DELTA(this.sprite),
      y: this.sprite.y + SETTINGS.ATTACK.Y_DELTA,
      whose: 'monster',
      speed: SETTINGS.ATTACK.SPEED,
      rotationAngleDeg: SETTINGS.ATTACK.ROTATION_ANGLE_DEG,
      scale: SETTINGS.ATTACK.SCALE,
      scaleSpeed: SETTINGS.ATTACK.SCALE_SPEED,
      yRender,
    });
  }

  private addPunch(): void {
    this.addAttack((sprite, delta) => {
      sprite.y -= (delta * SETTINGS.PUNCH_MAX_ARC_COEF) / sprite.x;
    });

    this.addAttack((sprite, delta) => {
      sprite.y -= (delta * SETTINGS.PUNCH_MAX_ARC_COEF) / 2 / sprite.x;
    });

    this.addAttack();

    this.addAttack((sprite, delta) => {
      sprite.y += (delta * SETTINGS.PUNCH_MAX_ARC_COEF) / 2 / sprite.x;
    });

    this.addAttack((sprite, delta) => {
      sprite.y += (delta * SETTINGS.PUNCH_MAX_ARC_COEF) / sprite.x;
    });
  }
}

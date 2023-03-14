import {Injectable, OnDestroy} from '@angular/core';
import {AnimatedSprite, Application, Ticker} from 'pixi.js';
import {BehaviorSubject, Observable} from 'rxjs';

import {AssetsService} from './assets.service';
import {AttacksService} from './attacks.service';
import {AudioService} from './audio.service';
import {BgService} from './bg.service';
import {SIZES} from '../consts/sizes.const';
import {IPower} from '../models/power.interface';
import {IShield} from '../models/shield.interface';
import {TYRender} from '../models/y-render.type';

const SETTINGS = {
  LIVES: 5,
  SPEED: BgService.SPEED + 3,
  ATTACK: {
    SPEED: BgService.SPEED + 6,
    SCALE: 0.21,
    SCALE_SPEED: 0.015,
    ROTATION_ANGLE_DEG: 7,
  },
  SHIELD_LIFETIME_MS: 10_000,
  PUNCH: {
    ARC_COEF: 400,
    LIFETIME_MS: 10_000,
  },
  LIGHTNING: {
    SPEED: 5,
    LIFETIME_MS: 10_000,
  },
} as const;

@Injectable({providedIn: 'root'})
export class HeroService implements OnDestroy {
  public readonly lives$: Observable<number>;
  public readonly isShieldActivated$: Observable<boolean>;
  public readonly isPunchActivated$: Observable<boolean>;
  public readonly isLightningActivated$: Observable<boolean>;
  public readonly score$: Observable<number>;
  public name = '-';
  public sprite: AnimatedSprite | null = null;

  public set lives(value: number) {
    this._lives$.next(value);
  }
  public get lives(): number {
    return this._lives$.value;
  }

  public get isShieldActivated(): boolean {
    return this.shield.isActivated$.value;
  }

  public get isPunchActivated(): boolean {
    return this.punch.isActivated$.value;
  }

  public get isLightningActivated(): boolean {
    return this.lightning.isActivated$.value;
  }

  public set score(value: number) {
    this._score$.next(value);
  }
  public get score(): number {
    return this._score$.value;
  }

  private readonly _lives$ = new BehaviorSubject<number>(SETTINGS.LIVES);
  private readonly _score$ = new BehaviorSubject(0);
  private readonly attack = {
    speed: SETTINGS.ATTACK.SPEED,
    isKeydownSpace: false,
    isKeyupSpace: false,

    set isAdd(value: boolean) {
      this.isKeydownSpace = value;
      this.isKeyupSpace = value;
    },
    get isAdd() {
      return this.isKeydownSpace && this.isKeyupSpace;
    },
  };
  private readonly shield: IShield = {
    sprite: null,
    isActivated$: new BehaviorSubject(false),
    lifetimeMs: SETTINGS.SHIELD_LIFETIME_MS,
  };
  private readonly punch: IPower = {
    isActivated$: new BehaviorSubject(false),
    lifetimeMs: SETTINGS.PUNCH.LIFETIME_MS,
  };
  private readonly lightning: IPower = {
    isActivated$: new BehaviorSubject(false),
    lifetimeMs: SETTINGS.LIGHTNING.LIFETIME_MS,
  };
  private game: Application | null = null;
  private speed = SETTINGS.SPEED;
  private isKeydownArrowUp = false;
  private isKeydownArrowDown = false;

  constructor(
    private readonly assetsService: AssetsService,
    private readonly attacksService: AttacksService,
    private readonly audioService: AudioService,
  ) {
    this.lives$ = this._lives$.asObservable();
    this.isShieldActivated$ = this.shield.isActivated$.asObservable();
    this.isPunchActivated$ = this.punch.isActivated$.asObservable();
    this.isLightningActivated$ = this.lightning.isActivated$.asObservable();
    this.score$ = this._score$.asObservable();
  }

  public start(game: Application): void {
    this.game = game;
    this.game.ticker.add(this.render);

    this.shield.sprite = new AnimatedSprite(this.assetsService.shield.animations['self']);
    this.shield.sprite.scale.set(2.7);
    this.shield.sprite.anchor.set(0.5);
    this.shield.sprite.animationSpeed = 0.4;
    this.shield.sprite.alpha = 0.5;
    this.shield.sprite.visible = false;
    this.shield.sprite.play();

    this.sprite = new AnimatedSprite(this.assetsService.hero.animations['self']);
    this.sprite.scale.set(0.32);
    this.sprite.anchor.set(0.5);
    this.sprite.animationSpeed = 0.4;
    this.sprite.position.set(SIZES.X.HERO + SIZES.X.DELTA(this.sprite), SIZES.Y.MID);
    this.sprite.play();
    this.sprite.addChild(this.shield.sprite);

    this.game.stage.addChild(this.sprite);

    addEventListener('keydown', this.keydownHandler);
    addEventListener('keyup', this.keyupHandler);
  }

  public ngOnDestroy(): void {
    if (!this.game) {
      return;
    }

    this.game.ticker.remove(this.render);

    removeEventListener('keydown', this.keydownHandler);
    removeEventListener('keyup', this.keyupHandler);

    this.game = null;

    this.shield.sprite = null;
    this.sprite = null;

    this.lives = SETTINGS.LIVES;
    this.score = 0;

    this.attack.speed = SETTINGS.ATTACK.SPEED;
    this.attack.isKeydownSpace = false;
    this.attack.isKeyupSpace = false;

    this.shield.isActivated$.next(false);
    this.shield.lifetimeMs = SETTINGS.SHIELD_LIFETIME_MS;

    this.punch.isActivated$.next(false);
    this.punch.lifetimeMs = SETTINGS.PUNCH.LIFETIME_MS;

    this.lightning.isActivated$.next(false);
    this.lightning.lifetimeMs = SETTINGS.LIGHTNING.LIFETIME_MS;

    this.speed = SETTINGS.SPEED;

    this.isKeydownArrowUp = false;
    this.isKeydownArrowUp = false;
  }

  public activateShield(): void {
    if (!this.shield.sprite) {
      return;
    }

    if (this.isShieldActivated) {
      this.shield.lifetimeMs = SETTINGS.SHIELD_LIFETIME_MS;

      return;
    }

    this.shield.sprite.visible = true;
    this.shield.isActivated$.next(true);
  }

  public activatePunch(): void {
    if (this.isPunchActivated) {
      this.punch.lifetimeMs = SETTINGS.SHIELD_LIFETIME_MS;

      return;
    }

    this.punch.isActivated$.next(true);
  }

  public activateLightning(): void {
    if (this.isLightningActivated) {
      this.lightning.lifetimeMs = SETTINGS.LIGHTNING.LIFETIME_MS;

      return;
    }

    this.speed += SETTINGS.LIGHTNING.SPEED;
    this.attack.speed += SETTINGS.LIGHTNING.SPEED;
    this.lightning.isActivated$.next(true);
  }

  private readonly render = (delta: number): void => {
    this.yRender(delta);

    this.attackRender();

    this.shieldRender(delta);
    this.punchRender(delta);
    this.lightningRender(delta);
  };

  private yRender(delta: number): void {
    if (this.isKeydownArrowUp) {
      this.upStep(delta);
    }

    if (this.isKeydownArrowDown) {
      this.downStep(delta);
    }
  }

  private upStep(delta: number): void {
    if (!this.sprite) {
      return;
    }

    if (this.sprite.y < SIZES.Y.MIN + SIZES.Y.DELTA(this.sprite)) {
      return;
    }

    this.sprite.y -= delta * this.speed;
  }

  private downStep(delta: number): void {
    if (!this.sprite) {
      return;
    }

    if (this.sprite.y > SIZES.HEIGHT - SIZES.Y.DELTA(this.sprite)) {
      return;
    }

    this.sprite.y += delta * this.speed;
  }

  private shieldRender(delta: number): void {
    if (!this.shield.sprite) {
      return;
    }

    if (!this.isShieldActivated) {
      return;
    }

    if (this.shield.lifetimeMs <= 0) {
      this.shield.sprite.visible = false;
      this.shield.isActivated$.next(false);

      this.shield.lifetimeMs = SETTINGS.SHIELD_LIFETIME_MS;

      return;
    }

    this.shield.lifetimeMs -= delta * Ticker.shared.deltaMS;
  }

  private attackRender(): void {
    if (!this.attack.isAdd) {
      return;
    }

    void this.audioService.heroAttack.replay();

    if (this.isPunchActivated) {
      this.addPunch();
    } else {
      this.addAttack();
    }

    this.attack.isAdd = false;
  }

  private addAttack(yRender?: TYRender): void {
    if (!this.sprite) {
      return;
    }

    this.attacksService.addOne({
      texture: this.assetsService.attacks['hero-attack'],
      x: this.sprite.x + SIZES.X.DELTA(this.sprite),
      y: this.sprite.y,
      whose: 'hero',
      speed: this.attack.speed,
      rotationAngleDeg: SETTINGS.ATTACK.ROTATION_ANGLE_DEG,
      scale: SETTINGS.ATTACK.SCALE,
      scaleSpeed: SETTINGS.ATTACK.SCALE_SPEED,
      yRender,
    });
  }

  private lightningRender(delta: number): void {
    if (!this.isLightningActivated) {
      return;
    }

    if (this.lightning.lifetimeMs <= 0) {
      this.speed -= SETTINGS.LIGHTNING.SPEED;
      this.attack.speed -= SETTINGS.LIGHTNING.SPEED;
      this.lightning.isActivated$.next(false);

      this.lightning.lifetimeMs = SETTINGS.PUNCH.LIFETIME_MS;

      return;
    }

    this.lightning.lifetimeMs -= delta * Ticker.shared.deltaMS;
  }

  private punchRender(delta: number): void {
    if (!this.isPunchActivated) {
      return;
    }

    if (this.punch.lifetimeMs <= 0) {
      this.punch.isActivated$.next(false);

      this.punch.lifetimeMs = SETTINGS.PUNCH.LIFETIME_MS;

      return;
    }

    this.punch.lifetimeMs -= delta * Ticker.shared.deltaMS;
  }

  private addPunch(): void {
    this.addAttack((sprite, delta) => {
      sprite.y -= sprite.x / (delta * SETTINGS.PUNCH.ARC_COEF);
    });

    this.addAttack();

    this.addAttack((sprite, delta) => {
      sprite.y += sprite.x / (delta * SETTINGS.PUNCH.ARC_COEF);
    });
  }

  private readonly keydownHandler = (event: KeyboardEvent): void => {
    switch (event.code) {
      case 'ArrowUp':
        this.isKeydownArrowUp = true;
        break;

      case 'ArrowDown':
        this.isKeydownArrowDown = true;
        break;

      case 'Space':
        this.attack.isKeydownSpace = true;
        break;
    }
  };

  private readonly keyupHandler = (event: KeyboardEvent): void => {
    switch (event.code) {
      case 'ArrowUp':
        this.isKeydownArrowUp = false;
        break;

      case 'ArrowDown':
        this.isKeydownArrowDown = false;
        break;

      case 'Space':
        this.attack.isKeyupSpace = true;
        break;
    }
  };
}

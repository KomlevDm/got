import {Injectable, OnDestroy} from '@angular/core';
import {AnimatedSprite, Application, Ticker} from 'pixi.js';
import {Observable, BehaviorSubject, map} from 'rxjs';
import {Socket} from 'socket.io-client';

import {SIZES} from '../../consts/sizes.const';
import {AssetsService} from '../assets.service';
import {AttacksService} from '../attacks.service';
import {AudioService} from '../audio.service';
import {BgService} from '../bg.service';

const SETTINGS = {
  LIVES: 50,
  SPEED: BgService.SPEED + 3,
  ATTACK: {
    SPEED: BgService.SPEED + 6,
    SCALE: 0.21,
    SCALE_SPEED: 0.015,
    ROTATION_ANGLE_DEG: 7,
    COUNTER: 20,
    TIMEOUT_S: 5,
  },
} as const;

@Injectable({providedIn: 'root'})
export class VsHeroService implements OnDestroy {
  public readonly lifePct$: Observable<number>;
  public readonly attacks$: Observable<number>;
  public name = '-';
  public sprite: AnimatedSprite | null = null;

  public set lives(value: number) {
    this._lives$.next(value);
  }
  public get lives(): number {
    return this._lives$.value;
  }

  private readonly _lives$ = new BehaviorSubject<number>(SETTINGS.LIVES);
  private readonly attack = {
    isKeydownSpace: false,
    isKeyupSpace: false,

    set isAdd(value: boolean) {
      this.isKeydownSpace = value;
      this.isKeyupSpace = value;
    },
    get isAdd() {
      return this.isKeydownSpace && this.isKeyupSpace && this.counter.value > 0;
    },

    counter: new BehaviorSubject(SETTINGS.ATTACK.COUNTER as number),
    timeoutMs: SETTINGS.ATTACK.TIMEOUT_S * 1000,
  };
  private game: Application | null = null;
  private socket: Socket | null = null;
  private isKeydownArrowUp = false;
  private isKeydownArrowDown = false;

  constructor(
    private readonly assetsService: AssetsService,
    private readonly attacksService: AttacksService,
    private readonly audioService: AudioService,
  ) {
    this.lifePct$ = this._lives$.asObservable().pipe(map(lives => (lives / SETTINGS.LIVES) * 100));
    this.attacks$ = this.attack.counter.asObservable();
  }

  public start(game: Application, socket: Socket): void {
    this.game = game;
    this.game.ticker.add(this.render);
    this.socket = socket;

    addEventListener('keydown', this.keydownHandler);
    addEventListener('keyup', this.keyupHandler);

    socket.on('opponentFound', () => {
      this.sprite = new AnimatedSprite(this.assetsService.hero.animations['self']);
      this.sprite.scale.set(0.32);
      this.sprite.anchor.set(0.5);
      this.sprite.animationSpeed = 0.4;
      this.sprite.position.set(SIZES.X.HERO + SIZES.X.DELTA(this.sprite), SIZES.Y.MID);
      this.sprite.play();

      game.stage.addChild(this.sprite);
    });

    socket.on('opponentLoss', () => {
      this.sprite?.destroy();
      this.sprite = null;
    });
  }

  public ngOnDestroy(): void {
    if (!this.game) {
      return;
    }

    this.game.ticker.remove(this.render);

    removeEventListener('keydown', this.keydownHandler);
    removeEventListener('keyup', this.keyupHandler);

    this.game = null;

    this.sprite = null;

    this.lives = SETTINGS.LIVES;

    this.attack.isKeydownSpace = false;
    this.attack.isKeyupSpace = false;

    this.isKeydownArrowUp = false;
    this.isKeydownArrowUp = false;
  }

  private readonly render = (delta: number): void => {
    if (!this.sprite) {
      return;
    }

    if (!this.socket) {
      return;
    }

    this.yRender(delta);

    this.attackRender(delta);
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

    if (!this.socket) {
      return;
    }

    if (this.sprite.y < SIZES.Y.MIN + SIZES.Y.DELTA(this.sprite)) {
      return;
    }

    this.sprite.y -= delta * SETTINGS.SPEED;

    this.socket.emit('tick', {
      y: this.sprite.y,
    });
  }

  private downStep(delta: number): void {
    if (!this.sprite) {
      return;
    }

    if (!this.socket) {
      return;
    }

    if (this.sprite.y > SIZES.HEIGHT - SIZES.Y.DELTA(this.sprite)) {
      return;
    }

    this.sprite.y += delta * SETTINGS.SPEED;

    this.socket.emit('tick', {
      y: this.sprite.y,
    });
  }

  private attackRender(delta: number): void {
    if (!this.attack.counter.value) {
      if (this.attack.timeoutMs <= 0) {
        this.attack.counter.next(SETTINGS.ATTACK.COUNTER);

        this.attack.timeoutMs = SETTINGS.ATTACK.TIMEOUT_S * 1000;

        this.attack.isAdd = false;
      } else {
        this.attack.timeoutMs -= delta * Ticker.shared.deltaMS;
      }
    }

    if (!this.attack.isAdd) {
      return;
    }

    void this.audioService.heroAttack.replay();

    this.addAttack();

    this.attack.isAdd = false;

    this.attack.counter.next(this.attack.counter.value - 1);
  }

  private addAttack(): void {
    if (!this.sprite) {
      return;
    }

    if (!this.socket) {
      return;
    }

    this.attacksService.addOne({
      texture: this.assetsService.attacks['hero-attack'],
      x: this.sprite.x + SIZES.X.DELTA(this.sprite),
      y: this.sprite.y,
      whose: 'hero',
      speed: SETTINGS.ATTACK.SPEED,
      rotationAngleDeg: SETTINGS.ATTACK.ROTATION_ANGLE_DEG,
      scale: SETTINGS.ATTACK.SCALE,
      scaleSpeed: SETTINGS.ATTACK.SCALE_SPEED,
    });

    this.socket.emit('tick', {
      attackOpts: {
        speed: SETTINGS.ATTACK.SPEED,
        rotationAngleDeg: SETTINGS.ATTACK.ROTATION_ANGLE_DEG,
        scale: SETTINGS.ATTACK.SCALE,
        scaleSpeed: SETTINGS.ATTACK.SCALE_SPEED,
      },
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

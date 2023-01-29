import * as _ from 'lodash-es';
import {AnimatedSprite, Ticker} from 'pixi.js';

import {IMonsterOptions} from './monster-options.interface';
import {IMonster} from './monster.interface';
import {IYMotion} from './y-motion.interface';
import {SIZES} from '../consts/sizes.const';
import {yRandomMotion} from '../helpers/y-random-motion.function';
import {BgService} from '../services/bg.service';

const SETTINGS = {
  ATTACK: {
    MIN_INTERVAL_S: 2,
    MAX_INTERVAL_S: 4,
    SPEED: BgService.SPEED + 8,
    SCALE: 0.21,
    SCALE_SPEED: 0.015,
    ROTATION_ANGLE_DEG: 7,
  },
  SPEED: BgService.SPEED + 1,
  SCORE: {
    MIN: 800,
    MAX: 1000,
  },
} as const;

export class Monster implements IMonster {
  public readonly sprite: AnimatedSprite;
  public readonly score = _.random(SETTINGS.SCORE.MIN, SETTINGS.SCORE.MAX);

  private readonly attack?: IMonsterOptions['attack'];
  private readonly speed: number;
  private readonly yMotion: IYMotion = {min: 0, max: SIZES.HEIGHT, canChange: false, dir: 1};
  private attackTime = SETTINGS.ATTACK.MIN_INTERVAL_S * 1000;

  constructor(opts: IMonsterOptions) {
    this.sprite = new AnimatedSprite(opts.textures);
    this.sprite.scale.set(opts.scale);
    this.sprite.anchor.set(0.5);
    this.sprite.animationSpeed = opts.animationSpeed;
    this.sprite.play();

    const yDelta = SIZES.Y.DELTA(this.sprite);
    this.yMotion.min = SIZES.Y.MIN + yDelta;
    this.yMotion.max = SIZES.HEIGHT - yDelta;
    const y = _.random(this.yMotion.min, this.yMotion.max);
    this.sprite.position.set(2 * SIZES.WIDTH + SIZES.X.DELTA(this.sprite), y);

    this.attack = opts.attack;
    this.speed = opts.speed ?? SETTINGS.SPEED;
    this.yMotion.dir = y > SIZES.Y.MID ? -1 : 1;
  }

  public render(delta: number): void {
    this.xRender(delta);
    this.yRender(delta);

    this.attackRender(delta);
  }

  private xRender(delta: number): void {
    this.sprite.x -= delta * this.speed;
  }

  private yRender(delta: number): void {
    yRandomMotion({
      sprite: this.sprite,
      delta,
      speed: this.speed,
      yMotion: this.yMotion,
      random: {scope: 300, sample: 50},
    });
  }

  private attackRender(delta: number): void {
    if (this.attack) {
      if (this.attackTime <= 0) {
        this.addAttack();

        this.attackTime = _.random(SETTINGS.ATTACK.MIN_INTERVAL_S, SETTINGS.ATTACK.MAX_INTERVAL_S) * 1000;
      } else {
        this.attackTime -= delta * Ticker.shared.deltaMS;
      }
    }
  }

  private addAttack(): void {
    if (!this.attack) {
      return;
    }

    this.attack.service.addOne({
      texture: this.attack.texture,
      x: this.sprite.x - SIZES.X.DELTA(this.sprite),
      y: this.sprite.y,
      whose: 'monster',
      speed: SETTINGS.ATTACK.SPEED,
      rotationAngleDeg: SETTINGS.ATTACK.ROTATION_ANGLE_DEG,
      scale: SETTINGS.ATTACK.SCALE,
      scaleSpeed: SETTINGS.ATTACK.SCALE_SPEED,
    });
  }
}

import * as _ from 'lodash-es';
import {AnimatedSprite, Ticker} from 'pixi.js';

import {IMonsterOptions} from './monster-options.interface';
import {IMonster} from './monster.interface';
import {SIZES} from '../consts/sizes.const';
import {BgService} from '../services/bg.service';

const SETTINGS = {
  ATTACK: {
    MIN_INTERVAL_S: 1,
    MAX_INTERVAL_S: 2,
    SPEED: BgService.SPEED + 10,
    SCALE: 0.24,
    SCALE_SPEED: 0.02,
    ROTATION_ANGLE_DEG: 10,
  },
  SPEED: BgService.SPEED + 1,
} as const;

export class InvulnerableMonster implements IMonster {
  public readonly sprite: AnimatedSprite;
  public readonly score: IMonster['score'] = 'invulnerable';

  private readonly attack?: IMonsterOptions['attack'];
  private readonly speed: number;
  private attackTime = SETTINGS.ATTACK.MIN_INTERVAL_S * 1000;

  constructor(opts: IMonsterOptions) {
    this.sprite = new AnimatedSprite(opts.textures);
    this.sprite.scale.set(opts.scale);
    this.sprite.anchor.set(0.5);
    this.sprite.animationSpeed = opts.animationSpeed;
    this.sprite.position.set(SIZES.WIDTH + SIZES.X.DELTA(this.sprite), SIZES.Y.MID);
    this.sprite.play();

    this.attack = opts.attack;
    this.speed = opts.speed ?? SETTINGS.SPEED;
  }

  public render(delta: number): void {
    this.xRender(delta);

    this.attackRender(delta);
  }

  private xRender(delta: number): void {
    this.sprite.x -= delta * this.speed;
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

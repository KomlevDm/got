import {Injectable, OnDestroy} from '@angular/core';
import {Application, Sprite} from 'pixi.js';

import {SIZES} from '../consts/sizes.const';
import {IAttackOptions} from '../models/attack-options.interface';
import {IAttack} from '../models/attack.interface';

@Injectable({providedIn: 'root'})
export class AttacksService implements OnDestroy {
  public readonly attacks = new Set<IAttack>();

  private game: Application | null = null;

  public start(game: Application): void {
    this.game = game;
    this.game.ticker.add(this.render);
  }

  public ngOnDestroy(): void {
    if (!this.game) {
      return;
    }

    this.game.ticker.remove(this.render);

    this.attacks.forEach(attack => attack.sprite.destroy());
    this.attacks.clear();

    this.game = null;
  }

  public deleteOneAsync(attack: IAttack): void {
    // pixijs optimization advice
    setTimeout(() => {
      if (!attack.sprite.destroyed) {
        attack.sprite.destroy();
      }

      this.attacks.delete(attack);
    });
  }

  public addOne(opts: IAttackOptions): void {
    if (!this.game) {
      return;
    }

    const sprite = new Sprite(opts.texture);
    sprite.scale.set(0);
    sprite.anchor.set(0.5);
    sprite.position.set(opts.x, opts.y);

    const dir = opts.whose === 'hero' ? 1 : -1;

    this.attacks.add({
      whose: opts.whose,
      sprite,
      render: delta => {
        sprite.x = sprite.x + dir * delta * opts.speed;
        opts.yRender?.(sprite, delta);
        sprite.angle = sprite.angle + dir * delta * opts.rotationAngleDeg;

        if (sprite.scale.x < opts.scale) {
          sprite.scale.set(sprite.scale.x + opts.scaleSpeed);
        }
      },
    });
    this.game.stage.addChild(sprite);
  }

  private readonly render = (delta: number): void => {
    this.attacks.forEach(attack => {
      const xDelta = SIZES.X.DELTA(attack.sprite);

      if (attack.whose === 'hero' && attack.sprite.x > SIZES.WIDTH + xDelta) {
        this.deleteOneAsync(attack);

        return;
      }

      if (attack.whose === 'monster' && attack.sprite.x < -xDelta) {
        this.deleteOneAsync(attack);

        return;
      }

      attack.render(delta);
    });
  };
}

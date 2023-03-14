import {Injectable, OnDestroy} from '@angular/core';
import {Application, Resource, Texture, TilingSprite} from 'pixi.js';

import {SIZES} from '../consts/sizes.const';

@Injectable({providedIn: 'root'})
export class BgService implements OnDestroy {
  public static readonly SPEED = 3;

  private game: Application | null = null;
  private sprite: TilingSprite | null = null;

  public start(game: Application, bgTexture: Texture<Resource>): void {
    this.game = game;

    this.sprite = TilingSprite.from(bgTexture, {width: SIZES.WIDTH, height: SIZES.HEIGHT});
    this.game.stage.addChild(this.sprite);

    this.game.ticker.add(this.render);
  }

  private readonly render = (delta: number): void => {
    if (!this.sprite) {
      return;
    }

    this.sprite.tilePosition.x -= delta * BgService.SPEED;
  };

  public ngOnDestroy(): void {
    if (!this.game) {
      return;
    }

    this.game.ticker.remove(this.render);

    this.game = null;
    this.sprite = null;
  }
}

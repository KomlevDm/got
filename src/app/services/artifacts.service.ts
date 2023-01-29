import {Injectable, OnDestroy} from '@angular/core';
import * as _ from 'lodash-es';
import {Application, Sprite, Texture, Ticker} from 'pixi.js';

import {AssetsService} from './assets.service';
import {BgService} from './bg.service';
import {SIZES} from '../consts/sizes.const';
import {EArtifactName} from '../models/artifact-name.enum';
import {IArtifact} from '../models/artifact.interface';

const SETTINGS = {
  GENERATION_TIME_S: {
    MIN: 10,
    MAX: 15,
  },
  SPEED: BgService.SPEED + 2,
  SCALE: {
    MIN: 0.23,
    MAX: 0.28,
    SPEED: 0.0015,
  },
} as const;

@Injectable({providedIn: 'root'})
export class ArtifactsService implements OnDestroy {
  public readonly artifacts = new Set<IArtifact>();

  private game: Application | null = null;
  private generationTimeMs = SETTINGS.GENERATION_TIME_S.MAX * 1000;

  constructor(private readonly assetsService: AssetsService) {}

  public start(game: Application): void {
    this.game = game;
    this.game.ticker.add(this.render);
  }

  public ngOnDestroy(): void {
    if (!this.game) {
      return;
    }

    this.game.ticker.remove(this.render);

    this.artifacts.forEach(artifact => artifact.sprite.destroy());
    this.artifacts.clear();

    this.game = null;
    this.generationTimeMs = SETTINGS.GENERATION_TIME_S.MAX * 1000;
  }

  public deleteOneAsync(artifact: IArtifact): void {
    // pixijs optimization advice
    setTimeout(() => {
      if (!artifact.sprite.destroyed) {
        artifact.sprite.destroy();
      }

      this.artifacts.delete(artifact);
    });
  }

  private readonly render = (delta: number): void => {
    this.artifacts.forEach(artifact => {
      if (artifact.sprite.x < -SIZES.X.DELTA(artifact.sprite)) {
        this.deleteOneAsync(artifact);

        return;
      }

      this.renderOne(delta, artifact);
    });

    if (this.generationTimeMs <= 0) {
      this.addOne();

      this.generationTimeMs = _.random(SETTINGS.GENERATION_TIME_S.MIN, SETTINGS.GENERATION_TIME_S.MAX) * 1000;
    } else {
      this.generationTimeMs -= delta * Ticker.shared.deltaMS;
    }
  };

  private addOne(): void {
    if (!this.game) {
      return;
    }

    const [name, texture] = _.sample(Object.entries(this.assetsService.artifacts)) as [EArtifactName, Texture];
    const sprite = new Sprite(texture);
    sprite.scale.set(SETTINGS.SCALE.MAX);
    sprite.anchor.set(0.5);
    const yDelta = SIZES.Y.DELTA(sprite);
    const y = _.random(SIZES.Y.MIN + yDelta, SIZES.HEIGHT - yDelta);
    sprite.position.set(SIZES.WIDTH + SIZES.X.DELTA(sprite), y);
    const artifact: IArtifact = {name, sprite, scaling: 1};

    this.artifacts.add(artifact);
    this.game.stage.addChild(artifact.sprite);
  }

  private renderOne(delta: number, artifact: IArtifact): void {
    artifact.sprite.x -= delta * SETTINGS.SPEED;

    if (artifact.sprite.scale.x <= SETTINGS.SCALE.MIN) {
      artifact.scaling = 1;
    }

    if (artifact.sprite.scale.x >= SETTINGS.SCALE.MAX) {
      artifact.scaling = -1;
    }

    artifact.sprite.scale.set(artifact.sprite.scale.x + artifact.scaling * SETTINGS.SCALE.SPEED);
  }
}

import {Injectable, OnDestroy} from '@angular/core';
import {AnimatedSprite, Application} from 'pixi.js';

import {OpponentService} from './opponent.service';
import {VsHeroService} from './vs-hero.service';
import {AssetsService} from '../assets.service';
import {AttacksService} from '../attacks.service';
import {AudioService} from '../audio.service';

@Injectable({providedIn: 'root'})
export class VsInteractionsService implements OnDestroy {
  private game: Application | null = null;

  constructor(
    private readonly audioService: AudioService,
    private readonly assetsService: AssetsService,
    private readonly vsHeroService: VsHeroService,
    private readonly attacksService: AttacksService,
    private readonly opponentService: OpponentService,
  ) {}

  public start(game: Application): void {
    this.game = game;
    this.game.ticker.add(this.render);
  }

  public ngOnDestroy(): void {
    if (!this.game) {
      return;
    }

    this.game.ticker.remove(this.render);

    this.game = null;
  }

  private readonly render = (): void => {
    this.vsHeroRender();

    this.opponentRender();
  };

  private vsHeroRender(): void {
    if (!this.vsHeroService.sprite) {
      return;
    }

    if (!this.opponentService.sprite) {
      return;
    }

    const {left: x0Hero, right: x1Hero, top: y0Hero, bottom: y1Hero} = this.vsHeroService.sprite.getBounds();

    this.attacksService.attacks.forEach(attack => {
      if (attack.whose === 'hero') {
        return;
      }

      const xAttack = attack.sprite.x;
      const yAttack = attack.sprite.y;

      if (xAttack >= x0Hero && xAttack <= x1Hero && yAttack >= y0Hero && yAttack <= y1Hero) {
        void this.audioService.heroDeath.replay();

        this.vsHeroService.lives -= 1;

        this.addBang(this.vsHeroService.sprite!.x, this.vsHeroService.sprite!.y);

        this.attacksService.deleteOneAsync(attack);
      }
    });
  }

  private opponentRender(): void {
    if (!this.opponentService.sprite) {
      return;
    }

    const {
      left: x0Opponent,
      right: x1Opponent,
      top: y0Opponent,
      bottom: y1Opponent,
    } = this.opponentService.sprite.getBounds();

    this.attacksService.attacks.forEach(attack => {
      if (attack.whose === 'monster') {
        return;
      }

      const xAttack = attack.sprite.x;
      const yAttack = attack.sprite.y;

      if (xAttack >= x0Opponent && xAttack <= x1Opponent && yAttack >= y0Opponent && yAttack <= y1Opponent) {
        void this.audioService.monsterDeath.replay();

        this.opponentService.lives -= 1;

        this.addBang(this.opponentService.sprite!.x, this.opponentService.sprite!.y);

        this.attacksService.deleteOneAsync(attack);
      }
    });
  }

  private addBang(x: number, y: number): void {
    if (!this.game) {
      return;
    }

    const sprite = new AnimatedSprite(this.assetsService.bang.animations['self']);
    sprite.animationSpeed = 0.4;
    sprite.scale.set(0.5);
    sprite.angle = 90;
    sprite.anchor.set(0.5);
    sprite.position.set(x, y);
    sprite.loop = false;
    sprite.onComplete = () => sprite.destroy();
    sprite.play();

    this.game.stage.addChild(sprite);
  }
}

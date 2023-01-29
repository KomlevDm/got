import {Injectable, OnDestroy} from '@angular/core';
import {AnimatedSprite, Application} from 'pixi.js';

import {ArtifactsService} from './artifacts.service';
import {AssetsService} from './assets.service';
import {AttacksService} from './attacks.service';
import {AudioService} from './audio.service';
import {BossService} from './boss.service';
import {HeroService} from './hero.service';
import {MonstersService} from './monsters.service';
import {EArtifactName} from '../models/artifact-name.enum';

@Injectable({providedIn: 'root'})
export class InteractionsService implements OnDestroy {
  private game: Application | null = null;

  constructor(
    private readonly audioService: AudioService,
    private readonly assetsService: AssetsService,
    private readonly heroService: HeroService,
    private readonly monstersService: MonstersService,
    private readonly attacksService: AttacksService,
    private readonly artifactsService: ArtifactsService,
    private readonly bossService: BossService,
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
    this.artifactsRender();

    this.heroRender();

    this.monstersRender();

    this.bossRender();
  };

  private artifactsRender(): void {
    if (!this.heroService.sprite) {
      return;
    }

    const {left: x0Hero, right: x1Hero, top: y0Hero, bottom: y1Hero} = this.heroService.sprite.getBounds();

    this.artifactsService.artifacts.forEach(artifact => {
      const xArtifact = artifact.sprite.x;
      const yArtifact = artifact.sprite.y;

      if (xArtifact >= x0Hero && xArtifact <= x1Hero && yArtifact >= y0Hero && yArtifact <= y1Hero) {
        switch (artifact.name) {
          case EArtifactName.Life:
            void this.audioService.getLifeArtifact.replay();
            this.heroService.lives += 1;
            break;

          case EArtifactName.Shield:
            void this.audioService.getShieldArtifact.replay();
            this.heroService.activateShield();
            break;

          case EArtifactName.Punch:
            void this.audioService.getPunchArtifact.replay();
            this.heroService.activatePunch();
            break;

          case EArtifactName.Lightning:
            void this.audioService.getLightningArtifact.replay();
            this.heroService.activateLightning();
            break;
        }

        this.artifactsService.deleteOneAsync(artifact);
      }
    });
  }

  private monstersRender(): void {
    this.attacksService.attacks.forEach(attack => {
      if (attack.whose === 'monster') {
        return;
      }

      const xAttack = attack.sprite.x;
      const yAttack = attack.sprite.y;

      this.monstersService.monsters.forEach(monster => {
        const {left: x0Monster, right: x1Monster, top: y0Monster, bottom: y1Monster} = monster.sprite.getBounds();

        if (xAttack >= x0Monster && xAttack <= x1Monster && yAttack >= y0Monster && yAttack <= y1Monster) {
          if (monster.score === 'invulnerable') {
            void this.audioService.monsterShield.replay();

            this.addSmallBang(xAttack, yAttack);
          } else {
            void this.audioService.monsterDeath.replay();

            this.addBang(monster.sprite.x, monster.sprite.y);

            this.heroService.score += monster.score;

            this.monstersService.deleteOneAsync(monster);
          }

          this.attacksService.deleteOneAsync(attack);
        }
      });
    });
  }

  private heroRender(): void {
    if (!this.heroService.sprite) {
      return;
    }

    const {left: x0Hero, right: x1Hero, top: y0Hero, bottom: y1Hero} = this.heroService.sprite.getBounds();

    this.attacksService.attacks.forEach(attack => {
      if (attack.whose === 'hero') {
        return;
      }

      const xAttack = attack.sprite.x;
      const yAttack = attack.sprite.y;

      if (xAttack >= x0Hero && xAttack <= x1Hero && yAttack >= y0Hero && yAttack <= y1Hero) {
        if (this.heroService.isShieldActivated) {
          void this.audioService.blockShield.replay();

          this.addSmallBang(xAttack, yAttack);
        } else {
          void this.audioService.heroDeath.replay();

          this.heroService.lives -= 1;

          this.addBang(this.heroService.sprite!.x, this.heroService.sprite!.y);
        }

        this.attacksService.deleteOneAsync(attack);
      }
    });

    this.monstersService.monsters.forEach(monster => {
      const xMonster = monster.sprite.x;
      const yMonster = monster.sprite.y;

      if (xMonster >= x0Hero && xMonster <= x1Hero && yMonster >= y0Hero && yMonster <= y1Hero) {
        if (this.heroService.isShieldActivated) {
          void this.audioService.blockShield.replay();

          this.addBang(xMonster, yMonster);
        } else {
          void this.audioService.heroDeath.replay();

          this.heroService.lives -= 1;

          this.addBang(this.heroService.sprite!.x, this.heroService.sprite!.y);
        }

        void this.audioService.monsterDeath.replay();

        this.monstersService.deleteOneAsync(monster);
      }
    });
  }

  private bossRender(): void {
    if (!this.bossService.sprite) {
      return;
    }

    const {left: x0Boss, right: x1Boss, top: y0Boss, bottom: y1Boss} = this.bossService.sprite.getBounds();

    this.attacksService.attacks.forEach(attack => {
      if (attack.whose === 'monster') {
        return;
      }

      const xAttack = attack.sprite.x;
      const yAttack = attack.sprite.y;

      if (xAttack >= x0Boss && xAttack <= x1Boss && yAttack >= y0Boss && yAttack <= y1Boss) {
        if (this.bossService.canUseMnemoShield) {
          void this.audioService.monsterShield.replay();

          this.addSmallBang(xAttack, yAttack);
        } else {
          void this.audioService.monsterDeath.replay();

          this.bossService.lives -= 1;

          this.addBang(this.bossService.sprite!.x, this.bossService.sprite!.y);
        }

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

  private addSmallBang(x: number, y: number): void {
    if (!this.game) {
      return;
    }

    const sprite = new AnimatedSprite(this.assetsService.smallBang.animations['self']);
    sprite.animationSpeed = 0.4;
    sprite.scale.set(0.5);
    sprite.anchor.set(0.5);
    sprite.position.set(x, y);
    sprite.loop = false;
    sprite.onComplete = () => sprite.destroy();
    sprite.play();

    this.game.stage.addChild(sprite);
  }
}

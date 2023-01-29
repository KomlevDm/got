import {Injectable, OnDestroy} from '@angular/core';
import * as _ from 'lodash-es';
import {Application} from 'pixi.js';

import {BlackDragonService} from './monsters/black-dragon.service';
import {DeathAngelService} from './monsters/death-angel.service';
import {DeathService} from './monsters/death.service';
import {IcePhoenixService} from './monsters/ice-phoenix.service';
import {SatanService} from './monsters/satan.service';
import {UndeadDragonService} from './monsters/undead-dragon.service';
import {SIZES} from '../consts/sizes.const';
import {IMonster} from '../models/monster.interface';

const SETTINGS = {
  GENERATION_TIME_S: {
    MIN: 2,
    MAX: 6,
    BOSS: 20,
  },
  INVULNERABLE_COUNTER: {
    MIN: 4,
    MAX: 6,
  },
} as const;

@Injectable({providedIn: 'root'})
export class MonstersService implements OnDestroy {
  public readonly monsters = new Set<IMonster>();
  public hasBoss = false;

  private game: Application | null = null;
  private generationTimeMs = SETTINGS.GENERATION_TIME_S.MIN * 1000;
  private invulnerableCounter: number = SETTINGS.INVULNERABLE_COUNTER.MAX;
  private invulnerableCounterValue = 0;

  constructor(
    private readonly deathAngelService: DeathAngelService,
    private readonly icePhoenixService: IcePhoenixService,
    private readonly blackDragonService: BlackDragonService,
    private readonly satanService: SatanService,
    private readonly deathService: DeathService,
    private readonly undeadDragonService: UndeadDragonService,
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

    this.monsters.forEach(monster => monster.sprite.destroy());
    this.monsters.clear();

    this.hasBoss = false;

    this.game = null;
    this.generationTimeMs = SETTINGS.GENERATION_TIME_S.MIN * 1000;
    this.invulnerableCounter = SETTINGS.INVULNERABLE_COUNTER.MAX;
    this.invulnerableCounterValue = 0;
  }

  public deleteOneAsync(monster: IMonster): void {
    // pixijs optimization advice
    setTimeout(() => {
      if (!monster.sprite.destroyed) {
        monster.sprite.destroy();
      }

      this.monsters.delete(monster);
    });
  }

  private readonly render = (delta: number): void => {
    if (!this.game) {
      return;
    }

    this.monsters.forEach(monster => {
      if (monster.sprite.x < -SIZES.X.DELTA(monster.sprite)) {
        this.deleteOneAsync(monster);

        return;
      }

      monster.render(delta);
    });

    if (this.generationTimeMs <= 0) {
      this.addOne();

      this.generationTimeMs =
        (this.hasBoss
          ? SETTINGS.GENERATION_TIME_S.BOSS
          : _.random(SETTINGS.GENERATION_TIME_S.MIN, SETTINGS.GENERATION_TIME_S.MAX)) * 1000;
    } else {
      this.generationTimeMs -= delta * this.game.ticker.deltaMS;
    }
  };

  private createOne(): IMonster {
    const isAllowInvulnerableMonster = this.invulnerableCounterValue === this.invulnerableCounter;
    if (isAllowInvulnerableMonster) {
      return this.createInvulnerableMonster();
    }

    return _.sample([
      this.deathService,
      this.deathAngelService,
      this.icePhoenixService,
      this.blackDragonService,
      this.satanService,
    ])!.create();
  }

  private addOne(): void {
    if (!this.game) {
      return;
    }

    const monster = this.createOne();

    this.monsters.add(monster);
    this.game.stage.addChild(monster.sprite);
    this.invulnerableCounterValue++;
  }

  private createInvulnerableMonster(): IMonster {
    this.invulnerableCounterValue = 0;
    this.invulnerableCounter = _.random(SETTINGS.INVULNERABLE_COUNTER.MIN, SETTINGS.INVULNERABLE_COUNTER.MAX);

    return _.sample([this.undeadDragonService])!.create();
  }
}

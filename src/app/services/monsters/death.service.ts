import {Injectable} from '@angular/core';

import {Monster} from '../../models/monster';
import {IMonsterService} from '../../models/monster-service.interface';
import {IMonster} from '../../models/monster.interface';
import {AssetsService} from '../assets.service';
import {BgService} from '../bg.service';

@Injectable({providedIn: 'root'})
export class DeathService implements IMonsterService {
  constructor(private readonly assetsService: AssetsService) {}

  public create(): IMonster {
    const death = new Monster({
      textures: this.assetsService.monsters.death.animations['self'],
      scale: 0.29,
      animationSpeed: 0.4,
      speed: BgService.SPEED + 5,
    });

    return death;
  }
}

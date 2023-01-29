import {Injectable} from '@angular/core';

import {Monster} from '../../models/monster';
import {IMonsterService} from '../../models/monster-service.interface';
import {IMonster} from '../../models/monster.interface';
import {AssetsService} from '../assets.service';
import {AttacksService} from '../attacks.service';

@Injectable({providedIn: 'root'})
export class DeathAngelService implements IMonsterService {
  constructor(private readonly assetsService: AssetsService, private readonly attacksService: AttacksService) {}

  public create(): IMonster {
    const deathAngel = new Monster({
      textures: this.assetsService.monsters.deathAngel.animations['self'],
      scale: 0.31,
      animationSpeed: 0.65,
      attack: {
        service: this.attacksService,
        texture: this.assetsService.attacks['attack-3'],
      },
    });

    return deathAngel;
  }
}

import {Injectable} from '@angular/core';

import {Monster} from '../../models/monster';
import {IMonsterService} from '../../models/monster-service.interface';
import {IMonster} from '../../models/monster.interface';
import {AssetsService} from '../assets.service';
import {AttacksService} from '../attacks.service';

@Injectable({providedIn: 'root'})
export class BlackDragonService implements IMonsterService {
  constructor(private readonly assetsService: AssetsService, private readonly attacksService: AttacksService) {}

  public create(): IMonster {
    const blackDragon = new Monster({
      textures: this.assetsService.monsters.blackDragon.animations['self'],
      scale: 0.58,
      animationSpeed: 0.3,
      attack: {
        service: this.attacksService,
        texture: this.assetsService.attacks['attack-6'],
      },
    });

    return blackDragon;
  }
}

import {Injectable} from '@angular/core';

import {Monster} from '../../models/monster';
import {IMonsterService} from '../../models/monster-service.interface';
import {IMonster} from '../../models/monster.interface';
import {AssetsService} from '../assets.service';
import {AttacksService} from '../attacks.service';

@Injectable({providedIn: 'root'})
export class IcePhoenixService implements IMonsterService {
  constructor(private readonly assetsService: AssetsService, private readonly attacksService: AttacksService) {}

  public create(): IMonster {
    const icePhoenix = new Monster({
      textures: this.assetsService.monsters.icePhoenix.animations['self'],
      scale: 0.41,
      animationSpeed: 0.6,
      attack: {
        service: this.attacksService,
        texture: this.assetsService.attacks['attack-4'],
      },
    });

    return icePhoenix;
  }
}

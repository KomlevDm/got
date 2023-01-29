import {Injectable} from '@angular/core';

import {Monster} from '../../models/monster';
import {IMonsterService} from '../../models/monster-service.interface';
import {IMonster} from '../../models/monster.interface';
import {AssetsService} from '../assets.service';
import {AttacksService} from '../attacks.service';

@Injectable({providedIn: 'root'})
export class SatanService implements IMonsterService {
  constructor(private readonly assetsService: AssetsService, private readonly attacksService: AttacksService) {}

  public create(): IMonster {
    const satan = new Monster({
      textures: this.assetsService.monsters.satan.animations['self'],
      scale: 0.36,
      animationSpeed: 0.2,
      attack: {
        service: this.attacksService,
        texture: this.assetsService.attacks['attack-2'],
      },
    });

    return satan;
  }
}

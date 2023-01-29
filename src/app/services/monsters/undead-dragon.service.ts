import {Injectable} from '@angular/core';

import {InvulnerableMonster} from '../../models/invulnerable-monster';
import {IMonsterService} from '../../models/monster-service.interface';
import {IMonster} from '../../models/monster.interface';
import {AssetsService} from '../assets.service';
import {AttacksService} from '../attacks.service';

@Injectable({providedIn: 'root'})
export class UndeadDragonService implements IMonsterService {
  constructor(private readonly assetsService: AssetsService, private readonly attacksService: AttacksService) {}

  public create(): IMonster {
    const undeadDragon = new InvulnerableMonster({
      textures: this.assetsService.monsters.undeadDragon.animations['self'],
      scale: 0.8,
      animationSpeed: 0.4,
      attack: {
        service: this.attacksService,
        texture: this.assetsService.attacks['attack-5'],
      },
    });

    return undeadDragon;
  }
}

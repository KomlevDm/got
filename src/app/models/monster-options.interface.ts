import {Texture} from 'pixi.js';

import {AttacksService} from '../services/attacks.service';

export interface IMonsterOptions {
  textures: Texture[];
  scale: number;
  animationSpeed: number;
  speed?: number;
  attack?: {
    service: AttacksService;
    texture: Texture;
  };
}

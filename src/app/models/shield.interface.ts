import {AnimatedSprite} from 'pixi.js';

import {IPower} from './power.interface';

export interface IShield extends IPower {
  sprite: AnimatedSprite | null;
}

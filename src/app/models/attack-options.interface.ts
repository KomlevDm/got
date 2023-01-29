import {Texture} from 'pixi.js';

import {IAttack} from './attack.interface';
import {TYRender} from './y-render.type';

export interface IAttackOptions {
  texture: Texture;
  x: number;
  y: number;
  whose: IAttack['whose'];
  speed: number;
  rotationAngleDeg: number;
  scale: number;
  scaleSpeed: number;
  yRender?: TYRender;
}

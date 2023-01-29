import {Sprite} from 'pixi.js';

export interface IAttack {
  whose: 'hero' | 'monster';
  sprite: Sprite;
  render: (delta: number) => void;
}

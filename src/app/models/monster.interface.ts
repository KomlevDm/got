import {Sprite} from 'pixi.js';

export interface IMonster {
  score: number | 'invulnerable';
  sprite: Sprite;
  render: (delta: number) => void;
}

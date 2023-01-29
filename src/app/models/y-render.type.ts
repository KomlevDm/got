import {Sprite} from 'pixi.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
export type TYRender = (sprite: Sprite, delta: number) => void;

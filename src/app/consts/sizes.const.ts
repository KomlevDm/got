import {Sprite} from 'pixi.js';

export const SIZES = {
  WIDTH: 1300,
  HEIGHT: 700,

  X: {
    ['DELTA']: (sprite: Sprite) => sprite.width * sprite.anchor.x,
    HERO: 30,
    VS_OPPONENT: 1270,
    BOSS: {
      CREATE: 1500,
      LIFE: 1270,
    },
  },

  Y: {
    MIN: 50,
    MID: 350,
    ['DELTA']: (sprite: Sprite) => sprite.height * sprite.anchor.y,
  },
} as const;

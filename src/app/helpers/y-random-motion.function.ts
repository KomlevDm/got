import * as _ from 'lodash-es';
import {Sprite} from 'pixi.js';

import {IYMotion} from '../models/y-motion.interface';

export function yRandomMotion({
  sprite,
  delta,
  speed,
  yMotion,
  random,
}: {
  sprite: Sprite;
  delta: number;
  speed: number;
  yMotion: IYMotion;
  random: {scope: number; sample: number};
}): void {
  if (yMotion.canChange) {
    if (sprite.y <= yMotion.min || sprite.y >= yMotion.max) {
      yMotion.dir *= -1;
      yMotion.canChange = false;
    }

    sprite.y += yMotion.dir * delta * speed;
  } else if (_.random(random.scope) === random.sample) {
    yMotion.canChange = true;
  }
}

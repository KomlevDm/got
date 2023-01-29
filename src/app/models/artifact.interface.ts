import {Sprite} from 'pixi.js';

import {EArtifactName} from './artifact-name.enum';

export interface IArtifact {
  name: EArtifactName;
  sprite: Sprite;
  scaling: -1 | 1;
}

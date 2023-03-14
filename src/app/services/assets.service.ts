import {Injectable} from '@angular/core';
import {Assets, Spritesheet, Texture} from 'pixi.js';

import {EArtifactName} from '../models/artifact-name.enum';

@Injectable({providedIn: 'root'})
export class AssetsService {
  public bg!: Texture;
  public vsBg!: Texture;

  public artifacts!: {
    [EArtifactName.Life]: Texture;
    [EArtifactName.Shield]: Texture;
    [EArtifactName.Punch]: Texture;
    [EArtifactName.Lightning]: Texture;
  };

  public hero!: Spritesheet;
  public shield!: Spritesheet;

  public monsters!: {
    deathAngel: Spritesheet;
    icePhoenix: Spritesheet;
    blackDragon: Spritesheet;
    satan: Spritesheet;
    death: Spritesheet;
    undeadDragon: Spritesheet;
  };

  public boss!: Spritesheet;

  public opponent!: Spritesheet;

  public attacks!: {
    'hero-attack': Texture;
    'attack-1': Texture;
    'attack-2': Texture;
    'attack-3': Texture;
    'attack-4': Texture;
    'attack-5': Texture;
    'attack-6': Texture;
  };

  public bang!: Spritesheet;
  public smallBang!: Spritesheet;

  public async init(): Promise<void> {
    this.bg = Texture.from('assets/img/game/bg/snow-forest.png');
    this.vsBg = Texture.from('assets/img/game/bg/sunset.png');

    this.artifacts = {
      life: Texture.from('assets/img/game/artifacts/life.png'),
      shield: Texture.from('assets/img/game/artifacts/shield.png'),
      punch: Texture.from('assets/img/game/artifacts/punch.png'),
      lightning: Texture.from('assets/img/game/artifacts/lightning.png'),
    };

    this.hero = await Assets.load('assets/img/game/hero/hero-sprite.json');
    this.shield = await Assets.load('assets/img/game/shield/shield-sprite.json');

    Assets.addBundle('monsters', {
      deathAngel: 'assets/img/game/monsters/death-angel/death-angel-sprite.json',
      icePhoenix: 'assets/img/game/monsters/ice-phoenix/ice-phoenix-sprite.json',
      blackDragon: 'assets/img/game/monsters/black-dragon/black-dragon-sprite.json',
      satan: 'assets/img/game/monsters/satan/satan-sprite.json',
      death: 'assets/img/game/monsters/death/death-sprite.json',
      undeadDragon: 'assets/img/game/monsters/undead-dragon/undead-dragon-sprite.json',
    });
    this.monsters = await Assets.loadBundle('monsters');

    this.boss = await Assets.load('assets/img/game/boss/boss-sprite.json');

    this.opponent = await Assets.load('assets/img/game/opponent/opponent-sprite.json');

    this.attacks = {
      'hero-attack': Texture.from('assets/img/game/attacks/hero-attack.png'),
      'attack-1': Texture.from('assets/img/game/attacks/attack-1.png'),
      'attack-2': Texture.from('assets/img/game/attacks/attack-2.png'),
      'attack-3': Texture.from('assets/img/game/attacks/attack-3.png'),
      'attack-4': Texture.from('assets/img/game/attacks/attack-4.png'),
      'attack-5': Texture.from('assets/img/game/attacks/attack-5.png'),
      'attack-6': Texture.from('assets/img/game/attacks/attack-6.png'),
    };

    this.bang = await Assets.load('assets/img/game/bang/bang-sprite.json');
    this.smallBang = await Assets.load('assets/img/game/small-bang/small-bang-sprite.json');
  }
}

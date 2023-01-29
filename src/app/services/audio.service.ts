import {Injectable} from '@angular/core';
import {AUDIO_LIST} from 'src/app/consts/audio-list.const';

import {BgAudio} from '../models/bg-audio';

@Injectable({providedIn: 'root'})
export class AudioService {
  public readonly bgAudio = new BgAudio();
  public activeButton!: HTMLAudioElement;
  public blockShield!: HTMLAudioElement;
  public closeDialog!: HTMLAudioElement;
  public gameOver!: HTMLAudioElement;
  public getLifeArtifact!: HTMLAudioElement;
  public getLightningArtifact!: HTMLAudioElement;
  public getPunchArtifact!: HTMLAudioElement;
  public getShieldArtifact!: HTMLAudioElement;
  public heroAttack!: HTMLAudioElement;
  public heroDeath!: HTMLAudioElement;
  public monsterDeath!: HTMLAudioElement;
  public monsterShield!: HTMLAudioElement;
  public openDialog!: HTMLAudioElement;
  public playGame!: HTMLAudioElement;
  public routing!: HTMLAudioElement;
  public victory!: HTMLAudioElement;

  constructor() {
    Audio.prototype.replay = function () {
      this.currentTime = 0;
      this.play();
    };
  }

  public init(): void {
    this.activeButton = new Audio(`assets/audio/${AUDIO_LIST.action.activeButton}`);

    this.blockShield = new Audio(`assets/audio/${AUDIO_LIST.action.blockShield}`);
    this.blockShield.volume = 0.5;

    this.closeDialog = new Audio(`assets/audio/${AUDIO_LIST.action.closeDialog}`);
    this.closeDialog.volume = 0.5;

    this.gameOver = new Audio(`assets/audio/${AUDIO_LIST.action.gameOver}`);

    this.getLifeArtifact = new Audio(`assets/audio/${AUDIO_LIST.action.getLifeArtifact}`);
    this.getLifeArtifact.volume = 0.5;

    this.getLightningArtifact = new Audio(`assets/audio/${AUDIO_LIST.action.getLightningArtifact}`);
    this.getLightningArtifact.volume = 0.5;

    this.getPunchArtifact = new Audio(`assets/audio/${AUDIO_LIST.action.getPunchArtifact}`);

    this.getShieldArtifact = new Audio(`assets/audio/${AUDIO_LIST.action.getShieldArtifact}`);
    this.getShieldArtifact.volume = 0.5;

    this.heroAttack = new Audio(`assets/audio/${AUDIO_LIST.action.heroAttack}`);
    this.heroAttack.volume = 0.25;

    this.heroDeath = new Audio(`assets/audio/${AUDIO_LIST.action.heroDeath}`);
    this.heroDeath.volume = 0.5;

    this.monsterDeath = new Audio(`assets/audio/${AUDIO_LIST.action.monsterDeath}`);

    this.monsterShield = new Audio(`assets/audio/${AUDIO_LIST.action.monsterShield}`);
    this.monsterShield.volume = 0.5;

    this.openDialog = new Audio(`assets/audio/${AUDIO_LIST.action.openDialog}`);
    this.openDialog.volume = 0.5;

    this.playGame = new Audio(`assets/audio/${AUDIO_LIST.action.playGame}`);

    this.routing = new Audio(`assets/audio/${AUDIO_LIST.action.routing}`);

    this.victory = new Audio(`assets/audio/${AUDIO_LIST.action.victory}`);

    this.bgAudio.play();
  }
}

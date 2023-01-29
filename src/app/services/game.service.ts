import {Injectable} from '@angular/core';
import {Application} from 'pixi.js';

import {ArtifactsService} from './artifacts.service';
import {AttacksService} from './attacks.service';
import {AudioService} from './audio.service';
import {BgService} from './bg.service';
import {BossService} from './boss.service';
import {HeroService} from './hero.service';
import {InteractionsService} from './interactions.service';
import {MonstersService} from './monsters.service';

@Injectable({providedIn: 'root'})
export class GameService {
  private host: HTMLElement | null = null;
  private game: Application | null = null;

  constructor(
    private readonly audioService: AudioService,
    private readonly bgService: BgService,
    private readonly heroService: HeroService,
    private readonly artifactsService: ArtifactsService,
    private readonly interactionsService: InteractionsService,
    private readonly monstersService: MonstersService,
    private readonly attacksService: AttacksService,
    private readonly bossService: BossService,
  ) {}

  public start(host: HTMLElement): void {
    if (this.game) {
      return;
    }

    this.host = host;

    this.game = new Application({resizeTo: host, resolution: window.devicePixelRatio});
    host.appendChild(this.game.view as unknown as Node);

    // pixijs optimization advice
    this.game.stage.cullable = true;

    this.bgService.start(this.game);
    this.artifactsService.start(this.game);
    this.attacksService.start(this.game);
    this.heroService.start(this.game);
    this.monstersService.start(this.game);
    this.interactionsService.start(this.game);
    this.bossService.start(this.game);

    void this.audioService.bgAudio.setVolume(0);
    void this.audioService.playGame.play();
  }

  public restart(): void {
    if (!this.host) {
      return;
    }

    this.destroy();

    this.start(this.host);
  }

  public pause(): void {
    if (!this.game) {
      return;
    }

    this.game.stop();
  }

  public continue(): void {
    if (!this.game) {
      return;
    }

    this.game.start();
  }

  public finish(): void {
    if (!this.host) {
      return;
    }

    this.destroy();

    this.host = null;

    void this.audioService.bgAudio.setVolume(1);
  }

  private destroy(): void {
    if (!this.game) {
      return;
    }

    this.bgService.ngOnDestroy();
    this.artifactsService.ngOnDestroy();
    this.attacksService.ngOnDestroy();
    this.heroService.ngOnDestroy();
    this.monstersService.ngOnDestroy();
    this.interactionsService.ngOnDestroy();
    this.bossService.ngOnDestroy();

    this.game.destroy(true, {children: true});

    this.game = null;
  }
}

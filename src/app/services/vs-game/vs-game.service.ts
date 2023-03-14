import {Injectable} from '@angular/core';
import {Application} from 'pixi.js';
import {Socket} from 'socket.io-client';

import {OpponentService} from './opponent.service';
import {VsHeroService} from './vs-hero.service';
import {VsInteractionsService} from './vs-interactions.service';
import {AssetsService} from '../assets.service';
import {AttacksService} from '../attacks.service';
import {AudioService} from '../audio.service';
import {BgService} from '../bg.service';

@Injectable({providedIn: 'root'})
export class VsGameService {
  private host: HTMLElement | null = null;
  private socket: Socket | null = null;
  private game: Application | null = null;

  constructor(
    private readonly assetsService: AssetsService,
    private readonly audioService: AudioService,
    private readonly bgService: BgService,
    private readonly vsHeroService: VsHeroService,
    private readonly vsInteractionsService: VsInteractionsService,
    private readonly attacksService: AttacksService,
    private readonly opponentService: OpponentService,
  ) {}

  public start(host: HTMLElement, socket: Socket): void {
    if (this.game) {
      return;
    }

    this.host = host;
    this.socket = socket;

    this.game = new Application({resizeTo: host, resolution: window.devicePixelRatio});
    host.appendChild(this.game.view as unknown as Node);

    // pixijs optimization advice
    this.game.stage.cullable = true;

    this.bgService.start(this.game, this.assetsService.vsBg);
    this.attacksService.start(this.game);
    this.vsHeroService.start(this.game, socket);
    this.vsInteractionsService.start(this.game);
    this.opponentService.start(this.game, socket);

    void this.audioService.bgAudio.setVolume(0);
    void this.audioService.playGame.play();

    socket.emit('opponentSearch', {name: this.vsHeroService.name});
  }
}

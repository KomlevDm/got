import {Injectable} from '@angular/core';

import {AssetsService} from './assets.service';
import {AudioService} from './audio.service';

@Injectable({providedIn: 'root'})
export class BootstrapService {
  public isGameActivated = false;

  constructor(private readonly audioService: AudioService, private readonly assetsService: AssetsService) {}

  public async bootstrap(): Promise<void> {
    await this.assetsService.init();
    this.audioService.init();

    this.isGameActivated = true;
  }
}

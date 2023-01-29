import {ELocalStorageKey} from './local-storage-key.enum';
import {AUDIO_LIST} from '../consts/audio-list.const';

export class BgAudio {
  public get isMuted(): boolean {
    const isMuted = localStorage.getItem(ELocalStorageKey.IsMutedBgAudio);

    return isMuted === null ? false : JSON.parse(isMuted);
  }

  private readonly sounds = Object.values(AUDIO_LIST.bg);
  private readonly currentSound: {element: HTMLAudioElement | null; index: number} = {element: null, index: 0};
  private volume = 1;

  public play(): void {
    this.currentSound.element = new Audio(`assets/audio/bg/${this.sounds[this.currentSound.index]}`);
    this.currentSound.element.volume = this.volume;
    this.currentSound.element.muted = this.isMuted;
    this.currentSound.element.autoplay = true;

    this.currentSound.element.onended = () => {
      const isEnd = this.currentSound.index === this.sounds.length - 1;
      this.currentSound.index = isEnd ? 0 : this.currentSound.index + 1;

      this.play();
    };
  }

  public toggleMute(): void {
    if (!this.currentSound.element) {
      return;
    }

    const newState = !this.isMuted;

    this.currentSound.element.muted = newState;

    localStorage.setItem(ELocalStorageKey.IsMutedBgAudio, newState.toString());
  }

  public setVolume(volume: number): void {
    if (!this.currentSound.element) {
      return;
    }

    this.volume = volume;
    this.currentSound.element.volume = volume;
  }
}

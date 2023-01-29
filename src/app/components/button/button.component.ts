import {Component, ChangeDetectionStrategy, HostListener, HostBinding, Input} from '@angular/core';

import {AudioService} from '../../services/audio.service';

@Component({
  standalone: true,
  selector: 'button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input()
  @HostBinding('class.disabled')
  public isDisabled = false;

  @Input()
  @HostBinding('class.hover')
  public isUseHover = true;

  constructor(private readonly audioService: AudioService) {}

  @HostListener('pointerenter')
  private hover(): void {
    if (!this.isUseHover) {
      return;
    }

    void this.audioService.activeButton.replay();
  }
}

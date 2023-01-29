import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AudioService} from 'src/app/services/audio.service';

@Component({
  standalone: true,
  selector: 'footer-panel',
  templateUrl: './footer-panel.component.html',
  styleUrls: ['./footer-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterPanelComponent {
  constructor(protected readonly audioService: AudioService) {}
}

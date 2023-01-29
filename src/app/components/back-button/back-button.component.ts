import {Component, Input, ChangeDetectionStrategy, HostListener} from '@angular/core';
import {Router} from '@angular/router';
import {AudioService} from 'src/app/services/audio.service';

@Component({
  standalone: true,
  selector: 'back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackButtonComponent {
  @Input()
  public backUrl = '/menu';

  constructor(private readonly router: Router, private readonly audioService: AudioService) {}

  @HostListener('document:keydown.escape')
  protected back(): void {
    void this.audioService.routing.replay();

    void this.router.navigateByUrl(this.backUrl);
  }
}

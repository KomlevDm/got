import {Component, ChangeDetectionStrategy, Input} from '@angular/core';

@Component({
  standalone: true,
  selector: 'logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {
  @Input()
  public text = '';
}

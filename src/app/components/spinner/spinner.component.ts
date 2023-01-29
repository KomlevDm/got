import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  standalone: true,
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {}

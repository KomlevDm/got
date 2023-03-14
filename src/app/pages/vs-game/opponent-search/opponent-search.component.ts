import {Component, ChangeDetectionStrategy} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import {SpinnerComponent} from '../../../components/spinner/spinner.component';

@Component({
  standalone: true,
  imports: [TranslateModule, SpinnerComponent],
  selector: 'opponent-search',
  templateUrl: './opponent-search.component.html',
  styleUrls: ['./opponent-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpponentSearchComponent {}

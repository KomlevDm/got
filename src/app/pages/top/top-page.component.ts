import {NgFor, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, HostBinding, OnInit} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import {BackButtonComponent} from '../../components/back-button/back-button.component';
import {ELocalStorageKey} from '../../models/local-storage-key.enum';
import {ITopRow} from '../../models/top-row.interface';

@Component({
  standalone: true,
  imports: [NgFor, NgIf, TranslateModule, BackButtonComponent],
  selector: 'top-page',
  templateUrl: './top-page.component.html',
  styleUrls: ['./top-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopPageComponent implements OnInit {
  protected rows: ITopRow[] = [];

  @HostBinding('class.page')
  private readonly isPage = true;

  public ngOnInit(): void {
    const topRaw = localStorage.getItem(ELocalStorageKey.Top);

    this.rows = topRaw ? JSON.parse(topRaw) : [];
  }
}

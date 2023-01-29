import {Component, ChangeDetectionStrategy, HostBinding} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {LogoComponent} from 'src/app/components/logo/logo.component';
import {ADestroyer} from 'src/app/helpers/destroyer.abstract';
import {AudioService} from 'src/app/services/audio.service';

import {FooterPanelComponent} from './footer-panel/footer-panel.component';
import {ToggleLanguageDialogComponent} from './toggle-language-dialog/toggle-language-dialog.component';
import {ButtonComponent} from '../../components/button/button.component';

@Component({
  standalone: true,
  imports: [RouterModule, TranslateModule, LogoComponent, ButtonComponent, FooterPanelComponent],
  selector: 'menu-page',
  templateUrl: './menu-page.component.html',
  styleUrls: ['./menu-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuPageComponent extends ADestroyer {
  @HostBinding('class.page')
  private readonly isPage = true;

  constructor(private readonly matDialog: MatDialog, protected readonly audioService: AudioService) {
    super();
  }

  protected openToggleLanguageDialog(): void {
    this.matDialog.open(ToggleLanguageDialogComponent);
  }
}

import {Component, ChangeDetectionStrategy, HostBinding} from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

import {ButtonComponent} from '../../../components/button/button.component';
import {ADialog} from '../../../helpers/dialog.abstract';
import {ELanguage} from '../../../models/language.enum';
import {ELocalStorageKey} from '../../../models/local-storage-key.enum';

@Component({
  standalone: true,
  imports: [TranslateModule, ButtonComponent],
  selector: 'toggle-language-dialog',
  templateUrl: './toggle-language-dialog.component.html',
  styleUrls: ['./toggle-language-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleLanguageDialogComponent extends ADialog {
  protected ELanguage = ELanguage;

  @HostBinding('class.dialog')
  private readonly isDialog = true;

  constructor(private readonly translateService: TranslateService) {
    super();
  }

  protected isSelected(language: ELanguage): boolean {
    return this.translateService.currentLang === language;
  }

  protected toggleLanguage(language: ELanguage): void {
    void this.audioService.activeButton.replay();

    this.translateService.use(language);
    localStorage.setItem(ELocalStorageKey.CurrentLanguage, language);
  }
}

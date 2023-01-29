import {HttpClient} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {TranslateLoader, TranslateModule as BaseTranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {ELanguage} from '../../models/language.enum';
import {ELocalStorageKey} from '../../models/local-storage-key.enum';

@NgModule({
  imports: [
    BaseTranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (httpClient: HttpClient) => new TranslateHttpLoader(httpClient),
        deps: [HttpClient],
      },
      defaultLanguage: localStorage.getItem(ELocalStorageKey.CurrentLanguage) || ELanguage.En,
    }),
  ],
})
export class TranslateModule {
  constructor(translateService: TranslateService) {
    translateService.use(translateService.defaultLang);
  }
}

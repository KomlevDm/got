import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {WrapRouterOutletComponent} from './components/wrap-router-outlet/wrap-router-outlet.component';
import {TranslateModule} from './modules/translate/translate.module';
import {MAT_DIALOG_DEFAULT_OPTIONS_PROVIDER} from './providers/mat-dialog/mat-dialog-default-options.provider';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    TranslateModule,
    WrapRouterOutletComponent,
  ],
  providers: [MAT_DIALOG_DEFAULT_OPTIONS_PROVIDER],
  bootstrap: [AppComponent],
})
export class AppModule {}

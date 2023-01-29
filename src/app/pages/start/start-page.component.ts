import {NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {LogoComponent} from 'src/app/components/logo/logo.component';
import {SpinnerComponent} from 'src/app/components/spinner/spinner.component';
import {DecreaseDirective} from 'src/app/directives/decrease/decrease.directive';

import {BootstrapService} from '../../services/bootstrap.service';

@Component({
  standalone: true,
  imports: [NgIf, TranslateModule, SpinnerComponent, LogoComponent, DecreaseDirective],
  selector: 'start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartPageComponent {
  protected isLoading = false;

  constructor(private readonly router: Router, private readonly bootstrapService: BootstrapService) {}

  protected async start(): Promise<void> {
    this.isLoading = true;

    await this.bootstrapService.bootstrap();
    await this.router.navigateByUrl('/menu');

    this.isLoading = false;
  }
}

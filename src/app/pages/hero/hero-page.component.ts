import {Component, ChangeDetectionStrategy, HostBinding} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {Router} from '@angular/router';
import {marker} from '@biesbjerg/ngx-translate-extract-marker';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs';
import {BackButtonComponent} from 'src/app/components/back-button/back-button.component';

import {ButtonComponent} from '../../components/button/button.component';
import {ADestroyer} from '../../helpers/destroyer.abstract';
import {HeroService} from '../../services/hero.service';
import {VsHeroService} from '../../services/vs-game/vs-hero.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, BackButtonComponent, ButtonComponent, MatIconModule],
  selector: 'hero-page',
  templateUrl: './hero-page.component.html',
  styleUrls: ['./hero-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroPageComponent extends ADestroyer {
  protected heroNameControl!: FormControl;
  protected isOpenedControlPanel = false;

  private static readonly HERO_DEFAULT_NAME_KEY = marker('HeroPage.HeroDefaultName');

  @HostBinding('class.page')
  private readonly isPage = true;

  constructor(
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly heroService: HeroService,
    private readonly vsHeroService: VsHeroService,
  ) {
    super();

    this.translateService
      .stream(HeroPageComponent.HERO_DEFAULT_NAME_KEY)
      .pipe(takeUntil(this.destroyer$))
      .subscribe(heroDefaultName => {
        this.heroNameControl = new FormControl(heroDefaultName, Validators.required);
      });
  }

  protected toggleControlPanel(): void {
    this.isOpenedControlPanel = !this.isOpenedControlPanel;
  }

  protected go(mode: 'single' | 'vs'): void {
    if (this.heroNameControl.invalid) {
      return;
    }

    if (mode === 'single') {
      this.heroService.name = this.heroNameControl.value;

      void this.router.navigateByUrl('/game');
    } else {
      this.vsHeroService.name = this.heroNameControl.value;

      void this.router.navigateByUrl('/vs-game');
    }
  }
}

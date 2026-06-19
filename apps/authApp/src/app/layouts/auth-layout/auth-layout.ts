import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedI18nService } from '@org/shared-i18n';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, TranslatePipe],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {
  private readonly i18n = inject(SharedI18nService);

  readonly languageLabel = computed(() =>
    this.i18n.currentLanguage() === 'ar' ? 'English' : 'العربية'
  );

  toggleLanguage(): void {
    this.i18n.toggleLanguage();
  }
}

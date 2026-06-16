import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type TextDirection = 'ltr' | 'rtl';

@Injectable({
  providedIn: 'root',
})
export class SharedI18nService {
  private readonly fallbackLang = 'en';
  private readonly rtlLanguages = ['ar'];

  constructor(
    private translateService: TranslateService,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.translateService.setFallbackLang(this.fallbackLang);

    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('lang') ?? this.fallbackLang;
      this.useLanguage(savedLang);
    } else {
      this.translateService.use(this.fallbackLang);
    }
  }

  useLanguage(lang: string): void {
    this.translateService.use(lang);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
      this.applyDocumentDirection(lang);
    }
  }

  getDirection(lang = this.translateService.getCurrentLang() ?? this.fallbackLang): TextDirection {
    return this.rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
  }

  private applyDocumentDirection(lang: string): void {
    this.document.documentElement.lang = lang;
    this.document.documentElement.dir = this.getDirection(lang);
  }
}

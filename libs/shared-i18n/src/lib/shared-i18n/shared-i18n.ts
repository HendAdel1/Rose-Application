import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type TextDirection = 'ltr' | 'rtl';

@Injectable({
  providedIn: 'root',
})
export class SharedI18nService {
  private readonly fallbackLang = 'en';
  private readonly rtlLanguages = ['ar'];
  private readonly languageCookieName = 'rose.lang';
  readonly currentLanguage = signal(this.fallbackLang);

  constructor(
    private translateService: TranslateService,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.translateService.setFallbackLang(this.fallbackLang);

    if (isPlatformBrowser(this.platformId)) {
      const savedLang = this.readCookie(this.languageCookieName) ?? this.fallbackLang;
      this.useLanguage(savedLang);
    } else {
      this.translateService.use(this.fallbackLang);
    }
  }

  useLanguage(lang: string): void {
    this.currentLanguage.set(lang);
    this.translateService.use(lang);

    if (isPlatformBrowser(this.platformId)) {
      this.writeCookie(this.languageCookieName, lang);
      this.applyDocumentDirection(lang);
    }
  }

  toggleLanguage(): void {
    this.useLanguage(this.currentLanguage() === 'ar' ? 'en' : 'ar');
  }

  getDirection(lang = this.translateService.getCurrentLang() ?? this.fallbackLang): TextDirection {
    return this.rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
  }

  private applyDocumentDirection(lang: string): void {
    this.document.documentElement.lang = lang;
    this.document.documentElement.dir = this.getDirection(lang);
  }

  private readCookie(name: string): string | null {
    const prefix = `${encodeURIComponent(name)}=`;
    const cookie = this.document.cookie
      .split('; ')
      .find((item) => item.startsWith(prefix));

    return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
  }

  private writeCookie(name: string, value: string): void {
    const maxAge = 60 * 60 * 24 * 365;

    this.document.cookie =
      `${encodeURIComponent(name)}=${encodeURIComponent(value)}; ` +
      `Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  }
}

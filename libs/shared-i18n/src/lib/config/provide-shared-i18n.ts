import { provideHttpClient } from '@angular/common/http';
import {
  ENVIRONMENT_INITIALIZER,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { SharedI18nService } from '../shared-i18n/shared-i18n';

export interface SharedI18nConfig {
  fallbackLang?: string;
  lang?: string;
  prefix?: string;
  suffix?: string;
}

export function provideSharedI18n(
  config: SharedI18nConfig = {},
): EnvironmentProviders {
  const fallbackLang = config.fallbackLang ?? 'en';

  return makeEnvironmentProviders([
    provideHttpClient(),
    provideTranslateService({
      fallbackLang,
      lang: config.lang ?? fallbackLang,
    }),
    provideTranslateHttpLoader({
      prefix: config.prefix ?? '/i18n/',
      suffix: config.suffix ?? '.json',
    }),
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => inject(SharedI18nService),
    },
  ]);
}

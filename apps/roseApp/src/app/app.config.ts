import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAuthDataAccess } from '@org/auth-data-access';
import { provideSharedI18n } from '@org/shared-i18n';
import { appRoutes } from './app.routes';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
    ),
    provideAuthDataAccess({
      apiBaseUrl: environment.baseUrl,
      apiRoot: environment.apiRoot,
    }),
    provideSharedI18n(),
  ],
};

import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuthDataAccess } from '@org/auth-data-access';
import { provideSharedI18n } from '@org/shared-i18n';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { appRoutes } from './app.routes';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideAuthDataAccess({ apiBaseUrl: environment.baseUrl }),
    provideSharedI18n(),
    provideAnimations(),
    provideToastr({
      closeButton: true,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true,
    }),
  ],
};

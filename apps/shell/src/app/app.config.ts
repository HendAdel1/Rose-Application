import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideSharedI18n } from '@org/shared-i18n';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideSharedI18n(),
    provideNoopAnimations(),
    provideToastr({
      closeButton: true,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
    }),
  ],
};

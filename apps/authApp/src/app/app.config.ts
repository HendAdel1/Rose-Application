import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAuthDataAccess } from '@org/auth-data-access';
import { environment } from './environments/environment';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(withFetch()),
    provideAuthDataAccess({ apiBaseUrl: environment.baseUrl }),
    provideClientHydration(),
    provideAnimations(),
    provideToastr({
      closeButton: true,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
    }),
  ],
};

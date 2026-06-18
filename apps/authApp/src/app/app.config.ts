import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAuthDataAccess } from '@org/auth-data-access';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(),
     provideRouter(appRoutes),
     provideHttpClient(withFetch()),
     provideAuthDataAccess({apiBaseUrl:environment.baseUrl}),


    ],
};

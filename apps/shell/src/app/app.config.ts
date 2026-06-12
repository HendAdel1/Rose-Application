import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,

} from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
     provideRouter(appRoutes),
     importProvidersFrom(NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }))
    ],
};

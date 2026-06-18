import {
  EnvironmentProviders,
  makeEnvironmentProviders,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import {
  AUTH_DATA_ACCESS_CONFIG,
  AuthApiService,
  AuthDataAccessConfig,
} from '../services/auth-api.service';
import { authErrorInterceptor } from '../interceptors/auth-error.interceptor';
import { authTokenInterceptor } from '../interceptors/auth-token.interceptor';

export function provideAuthDataAccess(
  config: AuthDataAccessConfig
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: AUTH_DATA_ACCESS_CONFIG,
      useValue: config

    },
    AuthApiService,
    provideNoopAnimations(),
    provideToastr({
      closeButton: true,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
    }),
    provideHttpClient(
      withInterceptors([authTokenInterceptor, authErrorInterceptor])
    ),
  ]);
}

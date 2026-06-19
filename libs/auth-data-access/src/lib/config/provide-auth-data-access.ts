import {
  EnvironmentProviders,
  makeEnvironmentProviders,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import {
  AUTH_DATA_ACCESS_CONFIG,
  AuthApiService,
  AuthDataAccessConfig,
} from '../services/auth-api.service';
import { authErrorInterceptor } from '../interceptors/auth-error.interceptor';
import { authLoadingInterceptor } from '../interceptors/auth-loading.interceptor';
import { authTokenInterceptor } from '../interceptors/auth-token.interceptor';

export function provideAuthDataAccess(
  config: AuthDataAccessConfig
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: AUTH_DATA_ACCESS_CONFIG,
      useValue: config,
    },
    AuthApiService,
    provideHttpClient(
      withInterceptors([
        authLoadingInterceptor,
        authTokenInterceptor,
        authErrorInterceptor,
      ])
    ),
  ]);
}

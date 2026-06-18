import {
  EnvironmentProviders,
  makeEnvironmentProviders,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MessageService } from 'primeng/api';

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
    MessageService,
    AuthApiService,
    provideHttpClient(
      withInterceptors([authTokenInterceptor, authErrorInterceptor])
    ),
  ]);
}

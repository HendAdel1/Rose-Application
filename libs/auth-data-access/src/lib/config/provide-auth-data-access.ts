import {
  EnvironmentProviders,
  makeEnvironmentProviders,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import {
  AUTH_DATA_ACCESS_CONFIG,
  AuthDataAccessConfig,
} from '../services/auth-api.service';
import { authTokenInterceptor } from '../interceptors/auth-token.interceptor';

export function provideAuthDataAccess(
  config: Partial<AuthDataAccessConfig> = {}
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: AUTH_DATA_ACCESS_CONFIG,
      useValue: {
        apiBaseUrl: '/api/auth',
        ...config,
      },
    },
    provideHttpClient(withInterceptors([authTokenInterceptor])),
  ]);
}

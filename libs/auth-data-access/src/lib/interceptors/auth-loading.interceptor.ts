import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { AUTH_DATA_ACCESS_CONFIG } from '../services/auth-api.service';
import { LoadingService } from '../services/loading.service';

export const authLoadingInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const config = inject(AUTH_DATA_ACCESS_CONFIG);
  const loading = inject(LoadingService);
  const apiBaseUrl = getApiScopeBaseUrl(config.apiBaseUrl);

  if (!request.url.startsWith(apiBaseUrl)) {
    return next(request);
  }

  loading.start();

  return next(request).pipe(finalize(() => loading.stop()));
};

function getApiScopeBaseUrl(apiBaseUrl: string): string {
  return apiBaseUrl.replace(/\/$/, '').replace(/\/auth$/, '');
}

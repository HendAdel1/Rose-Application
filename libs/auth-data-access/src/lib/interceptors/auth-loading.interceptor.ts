import {
  HttpHandlerFn,
  HttpContextToken,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { AUTH_DATA_ACCESS_CONFIG } from '../services/auth-api.service';
import { LoadingService } from '../services/loading.service';

export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);

export const authLoadingInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  if (request.context.get(SKIP_LOADING)) {
    return next(request);
  }

  const config = inject(AUTH_DATA_ACCESS_CONFIG);
  const loading = inject(LoadingService);
  const apiBaseUrl = getApiScopeBaseUrl(config.apiBaseUrl);
  const apiUrls = [apiBaseUrl, config.apiRoot].filter(
    (url): url is string => Boolean(url)
  );

  if (!apiUrls.some((url) => request.url.startsWith(url))) {
    return next(request);
  }

  loading.start();

  return next(request).pipe(finalize(() => loading.stop()));
};

function getApiScopeBaseUrl(apiBaseUrl: string): string {
  return apiBaseUrl.replace(/\/$/, '').replace(/\/auth$/, '');
}

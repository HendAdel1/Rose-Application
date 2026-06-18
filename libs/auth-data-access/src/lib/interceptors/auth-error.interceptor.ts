import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AUTH_DATA_ACCESS_CONFIG } from '../services/auth-api.service';
import { mapAuthError } from '../errors/auth-error.mapper';

export const authErrorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const config = inject(AUTH_DATA_ACCESS_CONFIG);
  const apiBaseUrl = config.apiBaseUrl.replace(/\/$/, '');

  if (!request.url.startsWith(apiBaseUrl)) {
    return next(request);
  }

  return next(request).pipe(
    catchError((error: unknown) => throwError(() => mapAuthError(error)))
  );
};

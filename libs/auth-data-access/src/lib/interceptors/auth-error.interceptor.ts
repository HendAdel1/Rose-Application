import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

import { AUTH_DATA_ACCESS_CONFIG } from '../services/auth-api.service';
import { AuthError } from '../errors/auth-error.model';
import { mapAuthError } from '../errors/auth-error.mapper';

export const authErrorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const config = inject(AUTH_DATA_ACCESS_CONFIG);
  // const toastr = inject(ToastrService);
  const apiBaseUrl = config.apiBaseUrl.replace(/\/$/, '');

  if (!request.url.startsWith(apiBaseUrl)) {
    return next(request);
  }

  return next(request).pipe(
    catchError((error: unknown) => {
      const authError = mapAuthError(error);

      // toastr.error(authError.message, getErrorSummary(authError));

      return throwError(() => authError);
    })
  );
};

function getErrorSummary(error: AuthError): string {
  if (error.code === 'NETWORK_ERROR') {
    return 'Connection error';
  }

  if (error.code === 'INVALID_CREDENTIALS') {
    return 'Authentication failed';
  }

  return 'Authentication error';
}

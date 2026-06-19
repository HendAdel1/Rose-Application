import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, mergeMap, of, throwError } from 'rxjs';

import { AUTH_DATA_ACCESS_CONFIG } from '../services/auth-api.service';
import { AuthError } from '../errors/auth-error.model';
import { mapAuthError } from '../errors/auth-error.mapper';

export const authErrorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const config = inject(AUTH_DATA_ACCESS_CONFIG);
  const toastr = inject(ToastrService);
  const apiBaseUrl = config.apiBaseUrl.replace(/\/$/, '');

  if (!request.url.startsWith(apiBaseUrl)) {
    return next(request);
  }

  return next(request).pipe(
    mergeMap((event) => {
      if (event instanceof HttpResponse && isFailedAuthResponse(event.body)) {
        const authError: AuthError = {
          code: 'BAD_REQUEST',
          message: getResponseMessage(event.body),
          status: event.status,
          details: event.body,
        };

        toastr.error(authError.message, getErrorSummary(authError));

        return throwError(() => authError);
      }

      return of(event);
    }),
    catchError((error: unknown) => {
      const authError = isAuthError(error) ? error : mapAuthError(error);

      if (!isAuthError(error)) {
        toastr.error(authError.message, getErrorSummary(authError));
      }

      return throwError(() => authError);
    })
  );
};

function isFailedAuthResponse(body: unknown): body is Record<string, unknown> {
  return (
    typeof body === 'object' &&
    body !== null &&
    'status' in body &&
    body['status'] === false
  );
}

function getResponseMessage(body: Record<string, unknown>): string {
  const message = body['message'];

  return typeof message === 'string' && message.trim().length > 0
    ? message
    : 'The authentication request could not be completed.';
}

function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

function getErrorSummary(error: AuthError): string {
  if (error.code === 'NETWORK_ERROR') {
    return 'Connection error';
  }

  if (error.code === 'INVALID_CREDENTIALS') {
    return 'Authentication failed';
  }

  return 'Authentication error';
}

import { HttpErrorResponse } from '@angular/common/http';

import { AuthError } from './auth-error.model';
import { BackendErrorBody } from './backend-error-body.model';

export function mapAuthError(error: unknown): AuthError {
  if (!(error instanceof HttpErrorResponse)) {
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected authentication error occurred.',
      details: error,
    };
  }

  if (error.status === 0) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Unable to connect to the authentication server.',
      status: error.status,
      details: error.error,
    };
  }

  const backendBody = normalizeBackendError(error.error);
  const backendMessage = extractBackendMessage(backendBody);

  return {
    code: mapStatusToCode(error.status),
    message: backendMessage ?? defaultMessageForStatus(error.status),
    status: error.status,
    details: backendBody ?? error.error,
  };
}

function normalizeBackendError(errorBody: unknown): BackendErrorBody | undefined {
  if (typeof errorBody === 'object' && errorBody !== null) {
    return errorBody as BackendErrorBody;
  }

  if (typeof errorBody === 'string' && errorBody.trim().length > 0) {
    return { message: errorBody };
  }

  return undefined;
}

function extractBackendMessage(errorBody: BackendErrorBody | undefined): string | undefined {
  const message = errorBody?.message ?? errorBody?.error;

  return typeof message === 'string' && message.trim().length > 0
    ? message
    : undefined;
}

function mapStatusToCode(status: number): AuthError['code'] {
  if (status === 400) {
    return 'BAD_REQUEST';
  }

  if (status === 401) {
    return 'INVALID_CREDENTIALS';
  }

  if (status === 403) {
    return 'FORBIDDEN';
  }

  if (status === 404) {
    return 'NOT_FOUND';
  }

  if (status === 422) {
    return 'VALIDATION_ERROR';
  }

  if (status >= 500) {
    return 'SERVER_ERROR';
  }

  return 'UNKNOWN_ERROR';
}

function defaultMessageForStatus(status: number): string {
  if (status === 400 || status === 422) {
    return 'Please check the submitted authentication data.';
  }

  if (status === 401) {
    return 'Invalid username or password.';
  }

  if (status === 403) {
    return 'You are not allowed to perform this authentication action.';
  }

  if (status === 404) {
    return 'The requested authentication resource was not found.';
  }

  if (status >= 500) {
    return 'Authentication service is currently unavailable.';
  }

  return 'An unexpected authentication error occurred.';
}

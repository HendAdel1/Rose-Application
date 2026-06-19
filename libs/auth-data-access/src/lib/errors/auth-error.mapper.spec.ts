import { HttpErrorResponse } from '@angular/common/http';

import { mapAuthError } from './auth-error.mapper';

describe('mapAuthError', () => {
  it('maps unauthorized responses to invalid credentials', () => {
    const error = mapAuthError(
      new HttpErrorResponse({
        status: 401,
        error: { message: 'Invalid username or password' },
      })
    );

    expect(error).toEqual({
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid username or password',
      status: 401,
      details: { message: 'Invalid username or password' },
    });
  });

  it('maps network errors', () => {
    const error = mapAuthError(
      new HttpErrorResponse({
        status: 0,
        error: new ProgressEvent('error'),
      })
    );

    expect(error.code).toBe('NETWORK_ERROR');
  });
});

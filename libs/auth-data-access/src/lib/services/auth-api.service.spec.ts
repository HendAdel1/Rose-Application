import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';

import { provideAuthDataAccess } from '../config/provide-auth-data-access';
import { AuthApiService } from './auth-api.service';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpMock: HttpTestingController;
  let toastr: ToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideAuthDataAccess({ apiBaseUrl: '/api/auth' }),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AuthApiService);
    httpMock = TestBed.inject(HttpTestingController);
    toastr = TestBed.inject(ToastrService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('sends email verification requests to the expected endpoint', () => {
    service
      .sendEmailVerification({ email: 'user@example.com' })
      .subscribe((response) => {
        expect(response.status).toBe(true);
      });

    const request = httpMock.expectOne('/api/auth/send-email-verification');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ email: 'user@example.com' });

    request.flush({
      status: true,
      code: 0,
      message: 'sent',
      payload: 'ok',
    });
  });

  it('logs in with username and password', () => {
    service
      .login({ username: 'johndoe', password: 'SecurePass1!' })
      .subscribe((response) => {
        expect(response.payload.token).toBe('token');
      });

    const request = httpMock.expectOne('/api/auth/login');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      username: 'johndoe',
      password: 'SecurePass1!',
    });

    request.flush({
      status: true,
      code: 0,
      message: 'signed in',
      payload: {
        token: 'token',
        user: { username: 'johndoe' },
      },
    });
  });

  it('maps backend errors to standardized auth errors', () => {
    const errorToastSpy = vi
      .spyOn(toastr, 'error')
      .mockImplementation(() => null);

    service.login({ username: 'wrong', password: 'bad' }).subscribe({
      next: () => fail('Expected request to fail'),
      error: (error) => {
        expect(error.code).toBe('INVALID_CREDENTIALS');
        expect(error.message).toBe('Invalid username or password');
      },
    });

    const request = httpMock.expectOne('/api/auth/login');

    request.flush(
      { message: 'Invalid username or password' },
      { status: 401, statusText: 'Unauthorized' }
    );

    expect(errorToastSpy).toHaveBeenCalledWith(
      'Invalid username or password',
      'Authentication failed'
    );
  });
});

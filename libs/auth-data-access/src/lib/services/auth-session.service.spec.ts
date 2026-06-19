import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import {
  AUTH_DATA_ACCESS_CONFIG,
  AuthApiService,
} from './auth-api.service';
import { AuthSessionService } from './auth-session.service';
import { TokenStorageService } from './token-storage.service';

describe('AuthSessionService', () => {
  let service: AuthSessionService;
  let httpMock: HttpTestingController;
  const clearAuthCookies = () => {
    ['rose.auth.token', 'rose.auth.refreshToken', 'rose.auth.user'].forEach(
      (key) => {
        document.cookie =
          `${encodeURIComponent(key)}=; Max-Age=0; Path=/; SameSite=Lax`;
      }
    );
  };

  beforeEach(() => {
    clearAuthCookies();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: AUTH_DATA_ACCESS_CONFIG,
          useValue: { apiBaseUrl: '/api/auth' },
        },
        AuthApiService,
        TokenStorageService,
        AuthSessionService,
      ],
    });

    service = TestBed.inject(AuthSessionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    clearAuthCookies();
  });

  it('stores the session after login succeeds', () => {
    service
      .login({ username: 'johndoe', password: 'SecurePass1!' })
      .subscribe();

    const request = httpMock.expectOne('/api/auth/login');

    request.flush({
      status: true,
      code: 0,
      message: 'signed in',
      payload: {
        token: 'access-token',
        user: { username: 'johndoe' },
      },
    });

    expect(service.isAuthenticated()).toBe(true);
    expect(service.token()).toBe('access-token');
    expect(service.currentUser()).toEqual({ username: 'johndoe' });
  });

  it('clears the session on logout', () => {
    service.setSession({
      token: 'access-token',
      user: { username: 'johndoe' },
    });

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.token()).toBeNull();
    expect(service.currentUser()).toBeNull();
  });
});

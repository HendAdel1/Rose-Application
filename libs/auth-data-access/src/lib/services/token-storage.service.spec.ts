import { TestBed } from '@angular/core/testing';

import { TokenStorageService } from './token-storage.service';

describe('TokenStorageService', () => {
  let service: TokenStorageService;
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
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenStorageService);
  });

  afterEach(() => {
    clearAuthCookies();
  });

  it('stores auth tokens and user data', () => {
    service.saveAuthPayload({
      token: 'access-token',
      refreshToken: 'refresh-token',
      user: { username: 'johndoe' },
    });

    expect(service.getToken()).toBe('access-token');
    expect(service.getRefreshToken()).toBe('refresh-token');
    expect(service.getUser()).toEqual({ username: 'johndoe' });
  });

  it('clears stored session data', () => {
    service.saveAuthPayload({
      token: 'access-token',
      user: { username: 'johndoe' },
    });

    service.clear();

    expect(service.getToken()).toBeNull();
    expect(service.getRefreshToken()).toBeNull();
    expect(service.getUser()).toBeNull();
  });
});

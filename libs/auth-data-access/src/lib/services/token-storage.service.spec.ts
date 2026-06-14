import { TestBed } from '@angular/core/testing';

import { TokenStorageService } from './token-storage.service';

describe('TokenStorageService', () => {
  let service: TokenStorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenStorageService);
  });

  afterEach(() => {
    localStorage.clear();
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

import { DOCUMENT } from '@angular/common';
import { Injectable, InjectionToken, inject } from '@angular/core';

import { AuthPayload, AuthUser } from '../models/auth.models';

export interface AuthStorageKeys {
  token: string;
  refreshToken: string;
  user: string;
}

export const AUTH_STORAGE_KEYS = new InjectionToken<AuthStorageKeys>(
  'AUTH_STORAGE_KEYS',
  {
    factory: () => ({
      token: 'rose.auth.token',
      refreshToken: 'rose.auth.refreshToken',
      user: 'rose.auth.user',
    }),
  }
);

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly keys = inject(AUTH_STORAGE_KEYS);
  private readonly document = inject(DOCUMENT);

  saveAuthPayload(payload: AuthPayload): void {
    this.setItem(this.keys.token, payload.token);

    if (payload.refreshToken) {
      this.setItem(this.keys.refreshToken, payload.refreshToken);
    } else {
      this.removeItem(this.keys.refreshToken);
    }

    if (payload.user) {
      this.setItem(this.keys.user, JSON.stringify(payload.user));
    } else {
      this.removeItem(this.keys.user);
    }
  }

  getToken(): string | null {
    return this.getItem(this.keys.token);
  }

  getRefreshToken(): string | null {
    return this.getItem(this.keys.refreshToken);
  }

  getUser(): AuthUser | null {
    const storedUser = this.getItem(this.keys.user);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      this.removeItem(this.keys.user);
      return null;
    }
  }

  hasToken(): boolean {
    return Boolean(this.getToken());
  }

  clear(): void {
    this.removeItem(this.keys.token);
    this.removeItem(this.keys.refreshToken);
    this.removeItem(this.keys.user);
  }

  private getItem(key: string): string | null {
    const prefix = `${encodeURIComponent(key)}=`;
    const cookie = this.document.cookie
      .split('; ')
      .find((item) => item.startsWith(prefix));

    return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
  }

  private setItem(key: string, value: string): void {
    const maxAge = 60 * 60 * 24 * 7;
    this.document.cookie =
      `${encodeURIComponent(key)}=${encodeURIComponent(value)}; ` +
      `Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  }

  private removeItem(key: string): void {
    this.document.cookie =
      `${encodeURIComponent(key)}=; Max-Age=0; Path=/; SameSite=Lax`;
  }
}

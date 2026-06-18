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

  private get storage(): Storage | null {
    return typeof localStorage === 'undefined' ? null : localStorage;
  }

  private getItem(key: string): string | null {
    return this.storage?.getItem(key) ?? null;
  }

  private setItem(key: string, value: string): void {
    this.storage?.setItem(key, value);
  }

  private removeItem(key: string): void {
    this.storage?.removeItem(key);
  }
}

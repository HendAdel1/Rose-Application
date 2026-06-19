import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { AuthApiService } from './auth-api.service';
import { TokenStorageService } from './token-storage.service';
import {
  AuthPayload,
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly authApi = inject(AuthApiService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly userState = signal<AuthUser | null>(this.tokenStorage.getUser());
  private readonly tokenState = signal<string | null>(this.tokenStorage.getToken());

  readonly currentUser = this.userState.asReadonly();
  readonly token = this.tokenState.asReadonly();
  readonly isAuthenticated = computed(() => Boolean(this.tokenState()));

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.authApi
      .login(request)
      .pipe(tap((response) => this.setSession(response.payload)));
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.authApi
      .register(request)
      .pipe(tap((response) => this.setSession(response.payload)));
  }

  setSession(payload: AuthPayload): void {
    this.tokenStorage.saveAuthPayload(payload);
    this.userState.set(payload.user ?? null);
    this.tokenState.set(payload.token);
  }

  restoreSession(): void {
    this.userState.set(this.tokenStorage.getUser());
    this.tokenState.set(this.tokenStorage.getToken());
  }

  logout(): void {
    this.tokenStorage.clear();
    this.userState.set(null);
    this.tokenState.set(null);
  }
}

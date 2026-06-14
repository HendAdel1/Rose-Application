import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { mapAuthError } from '../errors/auth-error.mapper';
import {
  AuthResponse,
  ConfirmEmailVerificationRequest,
  ForgotPasswordRequest,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  ResetPasswordRequest,
  SendEmailVerificationRequest,
} from '../models/auth.models';

export interface AuthDataAccessConfig {
  apiBaseUrl: string;
}

export const AUTH_DATA_ACCESS_CONFIG = new InjectionToken<AuthDataAccessConfig>(
  'AUTH_DATA_ACCESS_CONFIG',
  {
    factory: () => ({
      apiBaseUrl: '/api/auth',
    }),
  }
);

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(AUTH_DATA_ACCESS_CONFIG);

  sendEmailVerification(
    request: SendEmailVerificationRequest
  ): Observable<MessageResponse> {
    return this.post<MessageResponse>('send-email-verification', request);
  }

  confirmEmailVerification(
    request: ConfirmEmailVerificationRequest
  ): Observable<MessageResponse> {
    return this.post<MessageResponse>('confirm-email-verification', request);
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.post<AuthResponse>('register', request);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.post<AuthResponse>('login', request);
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<MessageResponse> {
    return this.post<MessageResponse>('forgot-password', request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<MessageResponse> {
    return this.post<MessageResponse>('reset-password', request);
  }

  private post<TResponse>(
    endpoint: string,
    request: unknown
  ): Observable<TResponse> {
    return this.http
      .post<TResponse>(`${this.normalizedBaseUrl}/${endpoint}`, request)
      .pipe(catchError((error: unknown) => throwError(() => mapAuthError(error))));
  }

  private get normalizedBaseUrl(): string {
    return this.config.apiBaseUrl.replace(/\/$/, '');
  }
}

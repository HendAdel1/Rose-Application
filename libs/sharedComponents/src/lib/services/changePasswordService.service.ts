import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../../apps/roseApp/src/app/environments/environment';
import { ChangePasswordRequest } from '../../../../../apps/roseApp/src/app/features/settings/models/change-password.model';
export type Gender = 'MALE' | 'FEMALE';

export interface ApiResponse<TPayload> {
  status: boolean;
  code: number;
  message: string;
  payload: TPayload;
}

export interface AuthUser {
  id?: string | number;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: Gender | string;
  roles?: string[];
  [key: string]: unknown;
}

export interface AuthPayload {
  user?: AuthUser | null;
  token: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  [key: string]: unknown;
}

export interface SendEmailVerificationRequest {
  email: string;
}

export interface ConfirmEmailVerificationRequest {
  email: string;
  code: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  gender: Gender;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export type MessageResponse = ApiResponse<string>;
export type AuthResponse = ApiResponse<AuthPayload>;


@Injectable({ providedIn: 'root' })
export class ChangePasswordService {
  private readonly http = inject(HttpClient);
  private readonly changePasswordUrl = `${environment.apiBaseUrl}/users/change-password`;

  changePassword(request: ChangePasswordRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(this.changePasswordUrl, request);
  }
}

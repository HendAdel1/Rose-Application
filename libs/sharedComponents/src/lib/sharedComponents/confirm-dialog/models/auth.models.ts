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

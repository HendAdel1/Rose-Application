import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  gender: string;
  photo: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  status: boolean;
  code: number;
  payload: {
    user: UserProfile;
  };
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  photo?: string;
}

export interface UploadResponse {
  status: boolean;
  code: number;
  payload: {
    url: string;
  };
}

export interface EmailChangeRequest {
  newEmail: string;
}

export interface EmailChangeResponse {
  status: boolean;
  code: number;
  message: string;
}

export interface EmailConfirmRequest {
  code: string;
}

export interface DeleteAccountResponse {
  status: boolean;
  code: number;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/users/profile`;
  private readonly emailUrl = `${environment.apiBaseUrl}/users/email`;
  private readonly uploadUrl = `${environment.apiBaseUrl}/upload`;

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(this.baseUrl);
  }

  updateProfile(data: UpdateProfileRequest): Observable<ProfileResponse> {
    return this.http.patch<ProfileResponse>(this.baseUrl, data);
  }

  uploadImage(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<UploadResponse>(this.uploadUrl, formData);
  }

  requestEmailChange(
    data: EmailChangeRequest,
  ): Observable<EmailChangeResponse> {
    return this.http.post<EmailChangeResponse>(
      `${this.emailUrl}/request`,
      data,
    );
  }

  confirmEmailChange(data: EmailConfirmRequest): Observable<ProfileResponse> {
    return this.http.post<ProfileResponse>(`${this.emailUrl}/confirm`, data);
  }

  deleteAccount(): Observable<DeleteAccountResponse> {
    return this.http.delete<DeleteAccountResponse>(`${environment.apiBaseUrl}/users/account`, { body: {} });
  }
}

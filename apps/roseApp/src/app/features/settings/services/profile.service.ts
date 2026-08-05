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
  gender?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/users/profile`;

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(this.baseUrl);
  }

  updateProfile(data: UpdateProfileRequest): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(this.baseUrl, data);
  }
}

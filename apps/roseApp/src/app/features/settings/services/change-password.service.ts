import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MessageResponse } from '@org/auth-data-access';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ChangePasswordRequest } from '../models/change-password.model';

@Injectable({ providedIn: 'root' })
export class ChangePasswordService {
  private readonly http = inject(HttpClient);
  private readonly changePasswordUrl = `${environment.apiBaseUrl}/users/change-password`;

  changePassword(request: ChangePasswordRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(this.changePasswordUrl, request);
  }
}

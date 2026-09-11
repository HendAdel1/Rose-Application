import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OccasionItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
}

export interface OccasionsResponse {
  status: boolean;
  code: number;
  payload?: {
    data?: OccasionItem[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class OccasionsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/occasions`;

  getOccasions(page = 1, limit = 100): Observable<OccasionItem[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<OccasionsResponse>(this.apiUrl, { params }).pipe(
      map((response) => response?.payload?.data ?? []),
    );
  }
}

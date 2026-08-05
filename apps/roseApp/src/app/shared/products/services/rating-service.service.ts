import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, map } from 'rxjs';
import { Occasion } from '../../../features/products/interface/Occasion';
import { Review } from '../../../features/products/interface/Rating';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
    private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/reviews?page=1&limit=20`;

    getReviews(): Observable<Review[]> {
      return this.httpClient.get<Review[]>(this.apiUrl).pipe(
        map((response: any) => response.payload.data as Review[]),
      );
    }
}

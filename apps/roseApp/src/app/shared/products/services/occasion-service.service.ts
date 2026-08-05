import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Occasion } from '../../../features/products/interface/Occasion';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OccasionService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/occasions?page=1&limit=20`;

  getOccasions(): Observable<Occasion[]> {
    return this.httpClient.get<Occasion[]>(this.apiUrl).pipe(
      map((response: any) => response.payload.data as Occasion[]),
    );

  }
}

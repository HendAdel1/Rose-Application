import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductApiResponse } from '../models/product-api.model';

/**
 * Service responsible for HTTP communication with the /api/products endpoint.
 */
@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiBaseUrl}/products`;

  /**
   * Fetches paginated products from GET /api/products
   *
   * @param page - Current page number (1-indexed)
   * @param limit - Number of records per page
   */
  getProducts(page = 1, limit = 20): Observable<ProductApiResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ProductApiResponse>(this.endpoint, { params });
  }
}

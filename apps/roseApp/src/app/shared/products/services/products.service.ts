import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductApiItem } from '../models/product-api-item.model';
import { ProductsPayload } from '../models/products-payload.model';
import { ProductsResponse } from '../models/products-response.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly productsUrl = `${environment.apiBaseUrl}/products`;

  getProducts(): Observable<ProductApiItem[]> {
    return this.http
      .get<ProductsResponse>(this.productsUrl)
      .pipe(map((response) => response.payload.data));
  }

  getProductsPage(page = 1, limit = 9): Observable<ProductsPayload> {
    const params = new HttpParams({
      fromObject: { page: String(page), limit: String(limit) },
    });

    return this.http
      .get<ProductsResponse>(this.productsUrl, { params })
      .pipe(map((response) => response.payload));
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateOccasionDto,
  Occasion,
  OccasionsApiResponse,
  OccasionsMetadata,
  OccasionsQueryParams,
  UpdateOccasionDto,
} from '../models/occasion.model';

@Injectable({
  providedIn: 'root',
})
export class OccasionsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/occasions`;

  getOccasions(
    query?: OccasionsQueryParams,
  ): Observable<{ occasions: Occasion[]; metadata: OccasionsMetadata }> {
    let params = new HttpParams();

    if (query?.page) {
      params = params.set('page', query.page.toString());
    }
    if (query?.limit) {
      params = params.set('limit', query.limit.toString());
    }
    if (query?.search && query.search.trim().length > 0) {
      params = params.set('search', query.search.trim());
    }

    return this.http.get<OccasionsApiResponse>(this.baseUrl, { params }).pipe(
      map((res) => {
        const rawOccasions =
          res.payload?.occasions ||
          res.payload?.data ||
          res.occasions ||
          [];

        const rawMetadata = res.payload?.metadata || res.metadata;
        const totalItems =
          rawMetadata?.totalItems ??
          res.payload?.total ??
          rawOccasions.length;
        const limit = rawMetadata?.limit ?? query?.limit ?? 10;
        const totalPages =
          rawMetadata?.totalPages ??
          Math.max(1, Math.ceil(totalItems / limit));
        const currentPage =
          rawMetadata?.currentPage ??
          res.payload?.currentPage ??
          query?.page ??
          1;

        const occasions: Occasion[] = rawOccasions.map((item) => ({
          ...item,
          id: item.id || item._id,
          productsCount: item.productsCount ?? item.productCount ?? 0,
        }));

        return {
          occasions,
          metadata: {
            currentPage,
            totalPages,
            limit,
            totalItems,
          },
        };
      }),
    );
  }

  getOccasionById(id: string): Observable<Occasion> {
    return this.http.get<{ payload?: { occasion?: Occasion }; occasion?: Occasion }>(`${this.baseUrl}/${id}`).pipe(
      map((res) => {
        const item = res.payload?.occasion || res.occasion || (res as unknown as Occasion);
        return {
          ...item,
          id: item.id || item._id || id,
          productsCount: item.productsCount ?? item.productCount ?? 0,
        };
      }),
    );
  }

  createOccasion(dto: CreateOccasionDto): Observable<Occasion> {
    return this.http.post<{ payload?: { occasion?: Occasion }; occasion?: Occasion }>(this.baseUrl, dto).pipe(
      map((res) => {
        const item = res.payload?.occasion || res.occasion || (res as unknown as Occasion);
        return {
          ...item,
          id: item.id || item._id,
        };
      }),
    );
  }

  updateOccasion(id: string, dto: UpdateOccasionDto): Observable<Occasion> {
    return this.http.patch<{ payload?: { occasion?: Occasion }; occasion?: Occasion }>(`${this.baseUrl}/${id}`, dto).pipe(
      map((res) => {
        const item = res.payload?.occasion || res.occasion || (res as unknown as Occasion);
        return {
          ...item,
          id: item.id || item._id || id,
        };
      }),
    );
  }

  deleteOccasion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, finalize, map, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { OccasionMapper } from '../mappers/occasion.mapper';
import {
  ApiResponse,
  CreateOccasionPayload,
  OccasionDto,
  OccasionsListPayload,
  UpdateOccasionPayload,
  UploadPayload,
} from '../models/occasion.model';
import { OccasionRow } from '../models/occasion-row.model';

@Injectable({ providedIn: 'root' })
export class OccasionsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/occasions`;
  private readonly uploadUrl = `${environment.apiBaseUrl}/upload`;

  private readonly _occasions = signal<OccasionRow[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _total = signal(0);
  private readonly _page = signal(1);
  private readonly _limit = signal(20);
  private readonly _search = signal('');

  readonly occasions = this._occasions.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly total = this._total.asReadonly();
  readonly page = this._page.asReadonly();
  readonly limit = this._limit.asReadonly();
  readonly search = this._search.asReadonly();

  loadOccasions(page = 1, limit = 20, search = this._search()): void {
    this._loading.set(true);
    this._error.set(null);
    this._page.set(page);
    this._limit.set(limit);
    this._search.set(search);

    this.fetchOccasions(page, limit, search)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (response) => {
          this._occasions.set(OccasionMapper.toUiModelList(response.items));
          this._total.set(response.total);
          this._page.set(response.page);
          this._limit.set(response.limit);
        },
        error: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Failed to fetch occasions';
          this._error.set(message);
          this._occasions.set([]);
          this._total.set(0);
        },
      });
  }

  getOccasions(page = 1, limit = 20, search = ''): Observable<{
    items: OccasionDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.fetchOccasions(page, limit, search);
  }

  getOccasionById(id: string): Observable<OccasionDto> {
    return this.http
      .get<ApiResponse<OccasionDto | { occasion?: OccasionDto }>>(`${this.baseUrl}/${id}`)
      .pipe(
        map((response) => {
          const payload = response.payload;
          if (!payload) {
            throw new Error('Occasion not found');
          }
          if ('occasion' in payload && payload.occasion) {
            return payload.occasion;
          }
          return payload as OccasionDto;
        }),
      );
  }

  createOccasion(payload: CreateOccasionPayload): Observable<OccasionDto> {
    return this.http
      .post<ApiResponse<OccasionDto | { occasion?: OccasionDto }>>(this.baseUrl, payload)
      .pipe(map((response) => this.unwrapOccasion(response)));
  }

  updateOccasion(id: string, payload: UpdateOccasionPayload): Observable<OccasionDto> {
    return this.http
      .patch<ApiResponse<OccasionDto | { occasion?: OccasionDto }>>(`${this.baseUrl}/${id}`, payload)
      .pipe(map((response) => this.unwrapOccasion(response)));
  }

  deleteOccasion(id: string): Observable<void> {
    return this.http.delete<ApiResponse<unknown>>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this._occasions.update((list) => list.filter((item) => item.id !== id));
        this._total.update((total) => Math.max(0, total - 1));
      }),
      map(() => undefined),
    );
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<ApiResponse<UploadPayload> & { url?: string }>(this.uploadUrl, formData).pipe(
      map((response) => {
        const url = response?.payload?.url ?? response?.url ?? (response as { data?: { url?: string } })?.data?.url;
        if (!url) {
          throw new Error('Upload failed');
        }
        return url;
      }),
    );
  }

  resolveImageUrl(path?: string | null): string | null {
    if (!path) {
      return null;
    }
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const origin = environment.apiBaseUrl.replace(/\/api\/?$/, '');
    return path.startsWith('/') ? `${origin}${path}` : `${environment.apiBaseUrl}/${path}`;
  }

  private fetchOccasions(
    page: number,
    limit: number,
    search: string,
  ): Observable<{
    items: OccasionDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<ApiResponse<OccasionsListPayload>>(this.baseUrl, { params }).pipe(
      map((response) => {
        const payload = response.payload ?? {};
        const items = payload.data ?? payload.occasions ?? [];
        const meta = payload.metadata;
        return {
          items,
          total: meta?.total ?? meta?.totalItems ?? items.length,
          page: meta?.page ?? meta?.currentPage ?? page,
          limit: meta?.limit ?? limit,
        };
      }),
    );
  }

  private unwrapOccasion(response?: unknown): OccasionDto {
    if (!response) {
      throw new Error('Empty occasion response');
    }
    const res = response as { payload?: OccasionDto | { occasion?: OccasionDto; data?: OccasionDto }; occasion?: OccasionDto; data?: OccasionDto };
    const target = res.payload ?? res;
    if (target && typeof target === 'object') {
      if ('occasion' in target && target.occasion) {
        return target.occasion;
      }
      if ('data' in target && target.data) {
        return target.data;
      }
      return target as OccasionDto;
    }
    return res as OccasionDto;
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, finalize, map, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CategoryMapper } from '../mappers/category.mapper';
import {
  ApiResponse,
  CategoriesListPayload,
  CategoryDto,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  UploadPayload,
} from '../models/category.model';
import { CategoryRow } from '../models/category-row.model';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/categories`;
  private readonly uploadUrl = `${environment.apiBaseUrl}/upload`;

  private readonly _categories = signal<CategoryRow[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _total = signal(0);
  private readonly _page = signal(1);
  private readonly _limit = signal(20);
  private readonly _search = signal('');

  readonly categories = this._categories.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly total = this._total.asReadonly();
  readonly page = this._page.asReadonly();
  readonly limit = this._limit.asReadonly();
  readonly search = this._search.asReadonly();

  loadCategories(page = 1, limit = 20, search = this._search()): void {
    this._loading.set(true);
    this._error.set(null);
    this._page.set(page);
    this._limit.set(limit);
    this._search.set(search);

    this.fetchCategories(page, limit, search)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (response) => {
          this._categories.set(CategoryMapper.toUiModelList(response.items));
          this._total.set(response.total);
          this._page.set(response.page);
          this._limit.set(response.limit);
        },
        error: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Failed to fetch categories';
          this._error.set(message);
          this._categories.set([]);
          this._total.set(0);
        },
      });
  }

  getCategories(page = 1, limit = 20, search = ''): Observable<{
    items: CategoryDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.fetchCategories(page, limit, search);
  }

  getCategoryById(id: string): Observable<CategoryDto> {
    return this.http
      .get<ApiResponse<CategoryDto | { category?: CategoryDto }>>(`${this.baseUrl}/${id}`)
      .pipe(
        map((response) => {
          const payload = response.payload;
          if (!payload) {
            throw new Error('Category not found');
          }
          if ('category' in payload && payload.category) {
            return payload.category;
          }
          return payload as CategoryDto;
        }),
      );
  }

  createCategory(payload: CreateCategoryPayload): Observable<CategoryDto> {
    return this.http
      .post<ApiResponse<CategoryDto | { category?: CategoryDto }>>(this.baseUrl, payload)
      .pipe(map((response) => this.unwrapCategory(response.payload)));
  }

  updateCategory(id: string, payload: UpdateCategoryPayload): Observable<CategoryDto> {
    return this.http
      .patch<ApiResponse<CategoryDto | { category?: CategoryDto }>>(`${this.baseUrl}/${id}`, payload)
      .pipe(map((response) => this.unwrapCategory(response.payload)));
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<ApiResponse<unknown>>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this._categories.update((list) => list.filter((item) => item.id !== id));
        this._total.update((total) => Math.max(0, total - 1));
      }),
      map(() => undefined),
    );
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<ApiResponse<UploadPayload>>(this.uploadUrl, formData).pipe(
      map((response) => {
        const url = response.payload?.url;
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

  private fetchCategories(
    page: number,
    limit: number,
    search: string,
  ): Observable<{
    items: CategoryDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<ApiResponse<CategoriesListPayload>>(this.baseUrl, { params }).pipe(
      map((response) => {
        const payload = response.payload ?? {};
        const items = payload.data ?? [];
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

  private unwrapCategory(payload?: CategoryDto | { category?: CategoryDto }): CategoryDto {
    if (!payload) {
      throw new Error('Empty category response');
    }
    if ('category' in payload && payload.category) {
      return payload.category;
    }
    return payload as CategoryDto;
  }
}

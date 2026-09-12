import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateProductResponse,
  ProductApiItem,
  ProductApiResponse,
  RestoreProductResponse,
} from '../models/product-api.model';
import { CreateProductPayload, UpdateProductPayload } from '../models/product.model';

export interface UploadPayload {
  url: string;
}

export interface ProductSingleApiResponse {
  status: boolean;
  code: number;
  message?: string;
  payload?: ProductApiItem | { product?: ProductApiItem };
}

export interface UploadApiResponse {
  status: boolean;
  code: number;
  payload?: UploadPayload;
}

/**
 * Service responsible for HTTP communication with the /api/products endpoint.
 */
@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiBaseUrl}/products`;
  private readonly uploadUrl = `${environment.apiBaseUrl}/upload`;

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

  /**
   * Creates a new product via POST /api/products
   *
   * @param payload - Product creation payload
   */
  createProduct(payload: CreateProductPayload): Observable<ProductApiItem> {
    return this.http
      .post<CreateProductResponse>(this.endpoint, payload)
      .pipe(
        map((response) => {
          const product = response.payload?.product;
          if (!product) {
            throw new Error('Failed to create product');
          }
          return product;
        }),
      );
  }

  /**
   * Fetches a single product by ID from GET /api/products/:id
   *
   * @param id - Product ID
   */
  getProductById(id: string): Observable<ProductApiItem> {
    return this.http.get<ProductSingleApiResponse>(`${this.endpoint}/${id}`).pipe(
      map((response) => {
        const payload = response?.payload;
        const product =
          payload && typeof payload === 'object' && 'product' in payload
            ? (payload as { product?: ProductApiItem }).product
            : (payload as ProductApiItem | undefined);

        if (!product) {
          throw new Error('Product not found');
        }
        return product;
      }),
    );
  }

  /**
   * Updates an existing product via PATCH /api/products/:id
   *
   * @param id - Product ID
   * @param payload - Partial product payload to update
   */
  updateProduct(id: string, payload: UpdateProductPayload): Observable<ProductApiItem> {
    return this.http.patch<ProductSingleApiResponse>(`${this.endpoint}/${id}`, payload).pipe(
      map((response) => {
        const payloadData = response?.payload;
        const product =
          payloadData && typeof payloadData === 'object' && 'product' in payloadData
            ? (payloadData as { product?: ProductApiItem }).product
            : (payloadData as ProductApiItem | undefined);

        if (!product) {
          throw new Error('Failed to update product');
        }
        return product;
      }),
    );
  }

  /**
   * Uploads an image file to the upload endpoint.
   *
   * @param file - File to upload
   */
  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<UploadApiResponse>(this.uploadUrl, formData).pipe(
      map((response) => {
        const url = response.payload?.url;
        if (!url) {
          throw new Error('Upload failed');
        }
        return url;
      }),
    );
  }

  /**
   * Fetches paginated deleted products from GET /api/products/deleted
   *
   * @param page - Current page number (1-indexed)
   * @param limit - Number of records per page
   */
  getDeletedProducts(page = 1, limit = 20): Observable<ProductApiResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ProductApiResponse>(`${this.endpoint}/deleted`, { params });
  }

  /**
   * Restores a soft-deleted product via POST /api/products/:id/restore
   *
   * @param id - Product ID
   */
  restoreProduct(id: string): Observable<ProductApiItem> {
    return this.http.post<RestoreProductResponse>(`${this.endpoint}/${id}/restore`, {}).pipe(
      map((response) => {
        const product = response.payload?.product;
        if (!product) {
          throw new Error('Failed to restore product');
        }
        return product;
      }),
    );
  }

  /**
   * Soft-deletes a product via DELETE /api/products/:id
   *
   * @param id - Product ID
   */
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<unknown>(`${this.endpoint}/${id}`).pipe(
      map(() => undefined),
    );
  }
}

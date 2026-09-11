import { Injectable, inject, signal } from '@angular/core';
import { Observable, finalize, tap } from 'rxjs';
import { CreateProductPayload, Product, UpdateProductPayload } from '../models/product.model';
import { ProductApiItem, ProductApiMetadata } from '../models/product-api.model';
import { ProductApiService } from './product-api.service';
import { ProductMapper } from '../mappers/product.mapper';


/**
 * Service responsible for managing Product state and data operations.
 *
 * Implements modern Angular Signals for high-performance reactive state management.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiService = inject(ProductApiService);

  private readonly _products = signal<Product[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _metadata = signal<ProductApiMetadata | null>(null);

  private readonly _deletedProducts = signal<Product[]>([]);
  private readonly _deletedLoading = signal<boolean>(false);
  private readonly _deletedMetadata = signal<ProductApiMetadata | null>(null);

  /** Readonly signal of current products */
  readonly products = this._products.asReadonly();

  /** Readonly signal for loading state */
  readonly loading = this._loading.asReadonly();

  /** Readonly signal for error state */
  readonly error = this._error.asReadonly();

  /** Readonly signal for pagination metadata */
  readonly metadata = this._metadata.asReadonly();

  /** Readonly signal of deleted products */
  readonly deletedProducts = this._deletedProducts.asReadonly();

  /** Readonly signal for deleted products loading state */
  readonly deletedLoading = this._deletedLoading.asReadonly();

  /** Readonly signal for deleted products pagination metadata */
  readonly deletedMetadata = this._deletedMetadata.asReadonly();

  /**
   * Fetches products from GET /api/products and updates reactive signal state.
   *
   * @param page - Current page number (1-indexed, default: 1)
   * @param limit - Number of records per page (default: 20)
   */
  loadProducts(page = 1, limit = 20): void {
    this._loading.set(true);
    this._error.set(null);

    this.apiService
      .getProducts(page, limit)
      .pipe(
        finalize(() => {
          this._loading.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          const items = response?.payload?.data ?? [];
          const metadata = response?.payload?.metadata ?? null;
          this._products.set(ProductMapper.toUiModelList(items));
          this._metadata.set(metadata);
        },
        error: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Failed to fetch products';
          this._error.set(message);
        },
      });
  }

  /**
   * Deletes a product by ID from the API and internal signal state.
   *
   * @param id - The ID of the product to remove.
   */
  deleteProduct(id: string): Observable<void> {
    return this.apiService.deleteProduct(id).pipe(
      tap(() => {
        this._products.update((list) => list.filter((item) => item.id !== id));
        this._metadata.update((meta) => {
          if (meta) {
            return { ...meta, total: Math.max(0, meta.total - 1) };
          }
          return meta;
        });
      }),
    );
  }

  /**
   * Creates a new product and updates internal signal state.
   *
   * @param payload - Product creation payload
   */
  createProduct(payload: CreateProductPayload): Observable<ProductApiItem> {
    return this.apiService.createProduct(payload).pipe(
      tap((newProduct) => {
        this._products.update((list) => [ProductMapper.toUiModel(newProduct), ...list]);
      }),
    );
  }

  /**
   * Fetches a single product by ID.
   *
   * @param id - Product ID
   */
  getProductById(id: string): Observable<ProductApiItem> {
    return this.apiService.getProductById(id);
  }

  /**
   * Updates an existing product and updates internal signal state.
   *
   * @param id - Product ID
   * @param payload - Partial update payload
   */
  updateProduct(id: string, payload: UpdateProductPayload): Observable<ProductApiItem> {
    return this.apiService.updateProduct(id, payload).pipe(
      tap((updatedProduct) => {
        this._products.update((list) =>
          list.map((item) =>
            item.id === id ? ProductMapper.toUiModel(updatedProduct) : item,
          ),
        );
      }),
    );
  }

  /**
   * Uploads an image file.
   *
   * @param file - File to upload
   */
  uploadImage(file: File): Observable<string> {
    return this.apiService.uploadImage(file);
  }

  /**
   * Fetches deleted products from GET /api/products/deleted
   *
   * @param page - Current page number (1-indexed, default: 1)
   * @param limit - Number of records per page (default: 20)
   */
  loadDeletedProducts(page = 1, limit = 20): void {
    this._deletedLoading.set(true);

    this.apiService
      .getDeletedProducts(page, limit)
      .pipe(
        finalize(() => {
          this._deletedLoading.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          const items = response?.payload?.data ?? [];
          const metadata = response?.payload?.metadata ?? null;
          this._deletedProducts.set(ProductMapper.toUiModelList(items));
          this._deletedMetadata.set(metadata);
        },
        error: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Failed to fetch deleted products';
          this._error.set(message);
        },
      });
  }

  /**
   * Restores a deleted product and updates internal signal state.
   *
   * @param id - Product ID
   */
  restoreProduct(id: string): Observable<ProductApiItem> {
    return this.apiService.restoreProduct(id).pipe(
      tap((restoredProduct) => {
        this._deletedProducts.update((list) => list.filter((item) => item.id !== id));
        this._deletedMetadata.update((meta) => {
          if (meta) {
            return { ...meta, total: Math.max(0, meta.total - 1) };
          }
          return meta;
        });
        this._products.update((list) => [ProductMapper.toUiModel(restoredProduct), ...list]);
        this._metadata.update((meta) => {
          if (meta) {
            return { ...meta, total: meta.total + 1 };
          }
          return meta;
        });
      })
    );
  }
}



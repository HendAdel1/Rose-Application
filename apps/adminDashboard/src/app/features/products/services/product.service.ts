import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductApiMetadata } from '../models/product-api.model';
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

  /** Readonly signal of current products */
  readonly products = this._products.asReadonly();

  /** Readonly signal for loading state */
  readonly loading = this._loading.asReadonly();

  /** Readonly signal for error state */
  readonly error = this._error.asReadonly();

  /** Readonly signal for pagination metadata */
  readonly metadata = this._metadata.asReadonly();

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
   * Deletes a product by ID from the signal state.
   *
   * @param id - The ID of the product to remove.
   */
  deleteProduct(id: string): void {
    this._products.update((list) => list.filter((item) => item.id !== id));
  }
}


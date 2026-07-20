import { Component, computed, DestroyRef, inject, signal, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { LoadingService } from '@org/auth-data-access';
import { TranslatePipe } from '@ngx-translate/core';
import { Paginator } from 'primeng/paginator';
import { PaginatorState } from 'primeng/types/paginator';
import { ProductApiItem } from '../../../../shared/products/models/product-api-item.model';
import { ProductsService } from '../../../../shared/products/services/products.service';
import { toUiCardProduct } from '../../../../shared/products/utils/product-card.utils';
import { UiCard } from '../../../../shared/ui-card/ui-card';
import { UiCardProduct } from '../../../../shared/ui-card/ui-card-product.model';

@Component({
  selector: 'app-products-grid',
  imports: [UiCard, Paginator, TranslatePipe],
  templateUrl: './products-grid.html',
  styleUrl: './products-grid.css',
  host: {
    class: 'block min-w-0 flex-1',
  },
})
export class ProductsGrid {
  private readonly productsService = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  readonly selectedCategoryId = signal<string | null>(null);
  readonly activeCategoryId = input<string | null>(null);
  readonly filteredProducts = computed(() => {
    const activeId = this.activeCategoryId();
    const list = this.products();

    if (!activeId) return list;
    if (activeId === 'Cards') return list;
    return list.filter(product => product.category?.id === activeId);
  });
  readonly loading = inject(LoadingService);
  readonly products = signal<ProductApiItem[]>([]);
  readonly page = signal(1);
  readonly limit = signal(12);
  readonly totalRecords = signal(0);

  readonly paginatorFirst = computed(() => (this.page() - 1) * this.limit());

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService
      .getProductsPage(this.page(), this.limit())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ data, metadata }) => {
          this.products.set(data);
          this.totalRecords.set(metadata.total);
        },
      });
  }

  onPageChange(event: PaginatorState): void {
    const nextPage = Math.floor((event.first ?? 0) / this.limit()) + 1;

    if (nextPage === this.page()) {
      return;
    }

    this.page.set(nextPage);
    this.loadProducts();
  }

  toCardProduct(product: ProductApiItem): UiCardProduct {
    return toUiCardProduct(product);
  }

  quickAddToCart(product: ProductApiItem): void {
    console.log('Quick add to cart', product.id);
  }

  viewProduct(product: ProductApiItem): void {
    void this.router.navigate(['/roseApp/products', product.id]);
  }
  onCategorySelected(categoryId: string): void {
    this.selectedCategoryId.set(categoryId);
  }

  onFilterCleared(): void {
    this.selectedCategoryId.set(null);
  }
}

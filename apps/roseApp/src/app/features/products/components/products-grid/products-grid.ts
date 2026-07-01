import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideEye, LucideHeart, LucideShoppingCart } from '@lucide/angular';
import { LoadingService } from '@org/auth-data-access';
import { TranslatePipe } from '@ngx-translate/core';
import { Paginator } from 'primeng/paginator';
import { PaginatorState } from 'primeng/types/paginator';
import { ProductApiItem } from '../../../../shared/products/models/product-api-item.model';
import { ProductsService } from '../../../../shared/products/services/products.service';
import {
  buildProductImageUrl,
  getProductCurrentPrice,
  getProductOldPrice,
} from '../../../../shared/products/utils/product-card.utils';
import { UiCard } from '../../../../shared/ui-card/ui-card';

@Component({
  selector: 'app-products-grid',
  imports: [UiCard, Paginator, LucideEye, LucideHeart, LucideShoppingCart, TranslatePipe],
  templateUrl: './products-grid.html',
  styleUrl: './products-grid.css',
  host: {
    class: 'block min-w-0 flex-1',
  },
})
export class ProductsGrid {
  private readonly productsService = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = inject(LoadingService);
  readonly products = signal<ProductApiItem[]>([]);
  readonly page = signal(1);
  readonly limit = signal(12);
  readonly totalRecords = signal(0);
  readonly stars = [1, 2, 3, 4, 5];

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

  quickAddToCart(product: ProductApiItem): void {
    console.log('Quick add to cart', product.id);
  }

  addToWishlist(product: ProductApiItem): void {
    console.log('Add to wishlist', product.id);
  }

  getImageUrl(product: ProductApiItem): string {
    return buildProductImageUrl(product.cover);
  }

  getCurrentPrice(product: ProductApiItem): number {
    return getProductCurrentPrice(product);
  }

  getOldPrice(product: ProductApiItem): number | null {
    return getProductOldPrice(product);
  }

  isOutOfStock(product: ProductApiItem): boolean {
    return (product.stock ?? 0) <= 0;
  }

  isStarFilled(product: ProductApiItem, star: number): boolean {
    return star <= Math.round(product.rating ?? 4);
  }

  formatPrice(price: number): string {
    return `${price.toFixed(2)} EGP`;
  }

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.src = '/logos/rose-logo.png';
  }
}

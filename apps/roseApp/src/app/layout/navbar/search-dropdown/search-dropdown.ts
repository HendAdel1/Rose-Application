import { Component, DestroyRef, computed, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { LucideStar } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { LoadingService } from '@org/auth-data-access';
import { ProductApiItem } from '../../../shared/products/models/product-api-item.model';
import { ProductsService } from '../../../shared/products/services/products.service';
import {
  buildProductImageUrl,
  getProductCurrentPrice,
} from '../../../shared/products/utils/product-card.utils';

export interface TitleSegment {
  text: string;
  matched: boolean;
}

@Component({
  selector: 'app-navbar-search-dropdown',
  imports: [TranslatePipe, LucideStar],
  templateUrl: './search-dropdown.html',
})
export class SearchDropdown {
  private readonly productsService = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  readonly loading = inject(LoadingService).isLoading;

  readonly searchTerm = input('');
  readonly resultSelected = output<void>();

  private readonly allProducts = signal<ProductApiItem[]>([]);

  readonly results = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const products = this.allProducts();

    if (!term) {
      return products;
    }

    return products.filter((product) =>
      product.title.toLowerCase().includes(term),
    );
  });

  constructor() {
    this.productsService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => this.allProducts.set(products),
        error: () => this.allProducts.set([]),
      });
  }

  imageUrl(product: ProductApiItem): string {
    return buildProductImageUrl(product.cover);
  }

  priceAmount(product: ProductApiItem): string {
    return `${getProductCurrentPrice(product)}`;
  }

  formatRating(product: ProductApiItem): string {
    return (product.rating ?? 0).toFixed(1);
  }

  titleSegments(product: ProductApiItem): TitleSegment[] {
    const term = this.searchTerm().trim();
    const title = product.title;

    if (!term) {
      return [{ text: title, matched: false }];
    }

    const lowerTitle = title.toLowerCase();
    const lowerTerm = term.toLowerCase();
    const segments: TitleSegment[] = [];
    let cursor = 0;

    while (cursor < title.length) {
      const matchIndex = lowerTitle.indexOf(lowerTerm, cursor);

      if (matchIndex === -1) {
        segments.push({ text: title.slice(cursor), matched: false });
        break;
      }

      if (matchIndex > cursor) {
        segments.push({ text: title.slice(cursor, matchIndex), matched: false });
      }

      segments.push({
        text: title.slice(matchIndex, matchIndex + term.length),
        matched: true,
      });
      cursor = matchIndex + term.length;
    }

    return segments;
  }

  selectProduct(product: ProductApiItem): void {
    void this.router.navigate(['/roseApp/products', product.id]);
    this.resultSelected.emit();
  }
}

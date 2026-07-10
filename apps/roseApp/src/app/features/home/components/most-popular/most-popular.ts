import { NgClass } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideMoveRight } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize, map } from 'rxjs';
import { CustomHeading } from '../../../../shared/custom-heading/custom-heading';
import { toMostPopularProducts } from '../../../../shared/products/mappers/popular-product.mapper';
import { PopularProduct } from '../../../../shared/products/models/popular-product.model';
import { ProductsService } from '../../../../shared/products/services/products.service';
import { UiCard } from '../../../../shared/ui-card/ui-card';

@Component({
  selector: 'app-most-popular',
  imports: [CustomHeading, UiCard, LucideMoveRight, NgClass, TranslatePipe],
  templateUrl: './most-popular.html',
  styleUrl: './most-popular.css',
})
export class MostPopular {
  private readonly productsService = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly products = signal<PopularProduct[]>([]);
  readonly isLoading = signal(false);
  readonly selectedTab = signal('Anniversary');

  readonly tabs = ['Wedding', 'Anniversary', 'Birthday', 'Engagement'];
  readonly maxCards = 12;

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);

    this.productsService
      .getProducts()
      .pipe(
        map((products) => toMostPopularProducts(products, this.maxCards)),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (products) => {
          this.products.set(products);
        },
      });
  }

  selectTab(tab: string): void {
    this.selectedTab.set(tab);
  }

  quickAddToCart(product: PopularProduct): void {
    console.log('Quick add to cart', product.id);
  }

  addToWishlist(product: PopularProduct): void {
    console.log('Add to wishlist', product.id);
  }
}

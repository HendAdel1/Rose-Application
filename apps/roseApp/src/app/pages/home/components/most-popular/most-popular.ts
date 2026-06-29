import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideEye, LucideHeart, LucideShoppingCart } from '@lucide/angular';
import { CustomHeading } from '../../../../shared/custom-heading/custom-heading';
import { PopularProduct } from '../../../../shared/products/models/popular-product.model';
import { ProductsService } from '../../../../shared/products/services/products.service';
import { UiCard } from '../../../../shared/ui-card/ui-card';

@Component({
  selector: 'app-most-popular',
  imports: [
    CustomHeading,
    UiCard,
    LucideEye,
    LucideHeart,
    LucideShoppingCart,
  ],
  templateUrl: './most-popular.html',
  styleUrl: './most-popular.css',
})
export class MostPopular {
  private readonly productsService = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly products = signal<PopularProduct[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly selectedTab = signal('Anniversary');

  readonly tabs = ['Wedding', 'Anniversary', 'Birthday', 'Engagement'];
  readonly stars = [1, 2, 3, 4, 5];
  readonly fallbackImage = '/logos/rose-logo.png';

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.productsService
      .getMostPopularProducts(12)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => {
          this.products.set(products);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Unable to load popular products.');
          this.isLoading.set(false);
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

  formatPrice(price: number): string {
    return `${price.toFixed(2)} EGP`;
  }

  isStarFilled(rating: number, star: number): boolean {
    return star <= Math.round(rating);
  }

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.src = this.fallbackImage;
  }
}

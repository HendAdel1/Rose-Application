import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CarouselModule } from 'primeng/carousel';
import { UiCard } from '../../../../shared/ui-card/ui-card';
import { CurrencyPipe } from '@angular/common';
import { LucideChevronLeft, LucideChevronRight, LucideEye, LucideHeart, LucideShoppingCart } from '@lucide/angular';
import { ProductsService } from '../../../../shared/products/services/products.service';
import { PopularProduct } from '../../../../shared/products/models/popular-product.model';
import { toMostPopularProducts } from '../../../../shared/products/mappers/popular-product.mapper';
import { finalize, map } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-best-selling',
  imports: [
    CarouselModule,
    UiCard,
    CurrencyPipe,
    LucideChevronLeft,
    LucideChevronRight,
    LucideEye,
    LucideHeart,
    LucideShoppingCart,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './best-selling.html',
  styleUrl: './best-selling.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BestSelling {
  private readonly productsService = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly products = signal<PopularProduct[]>([]);
  readonly isLoading = signal(false);
  readonly stars = [1, 2, 3, 4, 5];
  readonly fallbackImage = '/logos/rose-logo.png';

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);

    this.productsService
      .getProducts({ minRating: 4 })
      .pipe(
        map((products) => toMostPopularProducts(products, 12)),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (products) => {
          this.products.set(products);
        },
      });
  }

  exploreGifts() {
    console.log('Explore gifts clicked');
  }

  addToCart(product: PopularProduct) {
    console.log('Add to cart clicked for', product.title);
  }

  isStarFilled(rating: number, star: number): boolean {
    return star <= Math.round(rating);
  }

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.src = this.fallbackImage;
  }
}

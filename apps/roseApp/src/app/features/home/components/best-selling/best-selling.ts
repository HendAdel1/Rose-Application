import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { UiCard } from '../../../../shared/ui-card/ui-card';
import { LucideArrowRight, LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
import { ProductsService } from '../../../../shared/products/services/products.service';
import { PopularProduct } from '../../../../shared/products/models/popular-product.model';
import { toMostPopularProducts } from '../../../../shared/products/mappers/popular-product.mapper';
import { finalize, map, of, switchMap } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-best-selling',
  imports: [
    CarouselModule,
    UiCard,
    LucideChevronLeft,
    LucideChevronRight,
    LucideArrowRight,
    TranslatePipe,
  ],
  templateUrl: './best-selling.html',
  styleUrl: './best-selling.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BestSelling {
  private readonly productsService = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);

  readonly products = signal<PopularProduct[]>([]);
  readonly isLoading = signal(false);
  readonly maxCarouselItems = 12;
  readonly minRating = 4;

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);

    this.productsService
      .getProducts({ minRating: this.minRating })
      .pipe(
        switchMap((products) =>
          products.length > 0 ? of(products) : this.productsService.getProducts(),
        ),
        map((products) => toMostPopularProducts(products, this.maxCarouselItems)),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (products) => {
          this.products.set(products);
        },
      });
  }

  exploreGifts(): void {
    console.log('Explore gifts clicked');
  }

  addToCart(product: PopularProduct): void {
    this.cartService.addToCart({ productId: product.id, quantity: 1 });
  }

  viewProduct(product: PopularProduct): void {
    void this.router.navigate(['/roseApp/products', product.id]);
  }
}

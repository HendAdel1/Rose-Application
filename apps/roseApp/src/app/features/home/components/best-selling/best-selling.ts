import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { UiCard } from '../../../../shared/ui-card/ui-card';
import { LucideArrowRight, LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
import { ProductsService } from '../../../../shared/products/services/products.service';
import { PopularProduct } from '../../../../shared/products/models/popular-product.model';
import { toMostPopularProducts } from '../../../../shared/products/mappers/popular-product.mapper';
import { finalize, map } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-best-selling',
  imports: [
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

  @ViewChild('productsTrack') private productsTrack?: ElementRef<HTMLElement>;

  readonly products = signal<PopularProduct[]>([]);
  readonly isLoading = signal(false);
  readonly maxCarouselItems = 12;
  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);

    this.productsService
      .getProducts()
      .pipe(
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

  scrollProducts(direction: 'previous' | 'next'): void {
    const track = this.productsTrack?.nativeElement;
    if (!track) return;

    const firstCard = track.querySelector<HTMLElement>('.best-selling__item');
    const cardWidth = firstCard?.offsetWidth ?? 302;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 24;
    const scrollAmount = cardWidth + gap;

    track.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  }

  trackProduct(_: number, product: PopularProduct): string {
    return product.id ?? product.title;
  }

  exploreGifts(): void {
    console.log('Explore gifts clicked');
  }

  viewProduct(product: PopularProduct): void {
    void this.router.navigate(['/roseApp/products', product.id]);
  }
}

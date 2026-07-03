import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideEye,
  LucideHeart,
  LucideShoppingCart,
} from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, map, of, take } from 'rxjs';
import { CustomHeading } from '../../../../shared/custom-heading/custom-heading';
import { toMostPopularProducts } from '../../../../shared/products/mappers/popular-product.mapper';
import { PopularProduct } from '../../../../shared/products/models/popular-product.model';
import { ProductsService } from '../../../../shared/products/services/products.service';
import { UiCard } from '../../../../shared/ui-card/ui-card';

@Component({
  selector: 'app-related-products',
  imports: [
    CustomHeading,
    UiCard,
    LucideChevronLeft,
    LucideChevronRight,
    LucideEye,
    LucideHeart,
    LucideShoppingCart,
    TranslatePipe,
    RouterLink,
  ],
  templateUrl: './related-products.html',
  styleUrl: './related-products.css',
})
export class RelatedProducts implements OnInit {
  private readonly productsService = inject(ProductsService);

  @ViewChild('productsTrack') private productsTrack?: ElementRef<HTMLElement>;

  readonly products = signal<PopularProduct[]>([]);
  readonly loading = signal(true);
  readonly stars = [1, 2, 3, 4, 5];
  readonly fallbackImage = '/logos/rose-logo.png';

  ngOnInit(): void {
    this.productsService
      .getProducts()
      .pipe(
        map((products) => toMostPopularProducts(products, 10)),
        take(1),
        catchError(() => of([] as PopularProduct[])),
      )
      .subscribe((products: PopularProduct[]) => {
        this.products.set(products);
        this.loading.set(false);
      });
  }

  scrollProducts(direction: 'previous' | 'next'): void {
    const track = this.productsTrack?.nativeElement;

    if (!track) {
      return;
    }

    const firstCard = track.querySelector<HTMLElement>('.related-products__item');
    const cardWidth = firstCard?.offsetWidth ?? 302;
    const gap = 16;
    const scrollAmount = cardWidth + gap;

    track.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  }

  trackProduct(_: number, product: PopularProduct): string {
    return product.id ?? product.title;
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

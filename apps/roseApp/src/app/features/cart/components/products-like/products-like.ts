import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, of, take } from 'rxjs';
import { CustomHeading } from '../../../../shared/custom-heading/custom-heading';
import { toMostPopularProducts } from '../../../../shared/products/mappers/popular-product.mapper';
import { PopularProduct } from '../../../../shared/products/models/popular-product.model';
import { ProductsService } from '../../../../shared/products/services/products.service';
import { UiCard } from '../../../../shared/ui-card/ui-card';

@Component({
  selector: 'app-products-like',
  imports: [
    CustomHeading,
    UiCard,
    LucideChevronLeft,
    LucideChevronRight,
    TranslatePipe,
  ],
  templateUrl: './products-like.html',
  styleUrl: './products-like.css',
})
export class ProductsLike implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);

  @ViewChild('productsTrack') private productsTrack?: ElementRef<HTMLElement>;

  readonly products = signal<PopularProduct[]>([]);
  readonly loading = signal(true);
  readonly skeletonItems = [1, 2, 3, 4];
  private readonly maxCards = 10;

  ngOnInit(): void {
    this.productsService
      .getProducts()
      .pipe(
        map((products) => toMostPopularProducts(products, this.maxCards)),
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

    const firstCard = track.querySelector<HTMLElement>('.products-like__item');
    const cardWidth = firstCard?.offsetWidth ?? 302;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 16;
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
    if (product.isOutOfStock || product.stock <= 0) {
      this.toastr.warning(this.translate.instant('CART.PRODUCT_OUT_OF_STOCK'));
      return;
    }
    console.log('Quick add to cart', product.id);
  }

  viewProduct(product: PopularProduct): void {
    void this.router.navigate(['/roseApp/products', product.id]);
  }
}

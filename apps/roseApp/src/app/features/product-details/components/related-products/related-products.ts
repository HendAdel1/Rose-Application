import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, map, of, take } from 'rxjs';
import { CustomHeading } from '../../../../shared/custom-heading/custom-heading';
import { ProductApiItem } from '../../../../shared/products/models/product-api-item.model';
import { ProductsService } from '../../../../shared/products/services/products.service';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-related-products',
  imports: [CustomHeading, ProductCard, LucideChevronLeft, LucideChevronRight, TranslatePipe],
  templateUrl: './related-products.html',
  styleUrl: './related-products.css',
})
export class RelatedProducts implements OnInit {
  private readonly productsService = inject(ProductsService);

  @ViewChild('productsTrack') private productsTrack?: ElementRef<HTMLElement>;

  readonly products = signal<ProductApiItem[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.productsService
      .getProducts()
      .pipe(
        map((products) => products.slice(0, 10)),
        take(1),
        catchError(() => of([] as ProductApiItem[])),
      )
      .subscribe((products: ProductApiItem[]) => {
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

  trackProduct(_: number, product: ProductApiItem): string {
    return product.id ?? product.title;
  }
}

import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
import { catchError, of, take } from 'rxjs';
import { CustomHeading } from '../../../../shared/custom-heading/custom-heading';
import { Product } from '../../../../shared/products/models/product.model';
import { ProductsService } from '../../../../shared/products/services/products.service';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-related-products',
  imports: [CustomHeading, ProductCard, LucideChevronLeft, LucideChevronRight],
  templateUrl: './related-products.html',
  styleUrl: './related-products.css',
})
export class RelatedProducts implements OnInit {
  private readonly productsService = inject(ProductsService);

  @ViewChild('productsTrack') private productsTrack?: ElementRef<HTMLElement>;

  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.productsService
      .getProducts(10)
      .pipe(
        take(1),
        catchError(() => of([] as Product[])),
      )
      .subscribe((products: Product[]) => {
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

  trackProduct(_: number, product: Product): string {
    return product._id ?? product.id ?? product.title;
  }
}

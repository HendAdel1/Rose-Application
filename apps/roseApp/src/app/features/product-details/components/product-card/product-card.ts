import { Component, computed, input } from '@angular/core';
import {
  LucideShoppingCart,
  LucideStar,
} from '@lucide/angular';
import { ProductApiItem } from '../../../../shared/products/models/product-api-item.model';
import {
  buildProductImageUrl,
  getProductCurrentPrice,
  getProductOldPrice,
} from '../../../../shared/products/utils/product-card.utils';

@Component({
  selector: 'app-product-card',
  imports: [LucideShoppingCart, LucideStar],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  product = input.required<ProductApiItem>();

  readonly stars = [1, 2, 3, 4, 5];

  readonly imageUrl = computed(() => {
    const product = this.product();

    return buildProductImageUrl(product.cover);
  });

  readonly title = computed(() => this.product().title || 'Rose Product');

  readonly currentPrice = computed(() => getProductCurrentPrice(this.product()));

  readonly oldPrice = computed(() => getProductOldPrice(this.product()));

  readonly rating = computed(() => Math.round(this.product().rating ?? 4));

  readonly isOutOfStock = computed(() => (this.product().stock ?? 1) <= 0);

  readonly isNew = computed(() => !this.isOutOfStock());

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.src = '/logos/rose-logo.png';
    image.classList.add('product-card__img--fallback');
  }
}

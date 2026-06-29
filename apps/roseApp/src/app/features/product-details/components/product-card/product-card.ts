import { Component, computed, inject, input } from '@angular/core';
import {
  LucideHeart,
  LucidePlus,
  LucideShoppingCart,
  LucideStar,
} from '@lucide/angular';
import { Product, ProductImage } from '../../../../shared/products/models/product.model';
import { ProductsService } from '../../../../shared/products/services/products.service';

@Component({
  selector: 'app-product-card',
  imports: [LucideShoppingCart, LucideStar],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  private readonly productsService = inject(ProductsService);

  product = input.required<Product>();

  readonly stars = [1, 2, 3, 4, 5];

  readonly imageUrl = computed(() => {
    const product = this.product();
    const image =
      product.cover ??
      product.imageCover ??
      product.imgCover ??
      product.image ??
      product.picture ??
      product.thumbnail ??
      this.readImage(product.gallery?.[0]) ??
      this.readImage(product.images?.[0]);

    return this.productsService.buildImageUrl(image);
  });

  readonly title = computed(() => this.product().title || this.product().name || 'Rose Product');

  readonly currentPrice = computed(() => {
    const product = this.product();

    return Number(product.priceAfterDiscount ?? product.discountPrice ?? product.finalPrice ?? product.price ?? 0);
  });

  readonly oldPrice = computed(() => {
    const product = this.product();
    const price = Number(product.price ?? 0);

    return this.currentPrice() < price ? price : null;
  });

  readonly rating = computed(() => Math.round(this.product().ratingsAverage ?? 4));

  readonly isOutOfStock = computed(() => (this.product().stock ?? 1) <= 0);

  readonly isNew = computed(() => !this.isOutOfStock());

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.src = '/logos/rose-logo.png';
    image.classList.add('product-card__img--fallback');
  }

  private readImage(image?: string | ProductImage): string | undefined {
    if (!image) {
      return undefined;
    }

    if (typeof image === 'string') {
      return image;
    }

    return image.url ?? image.secure_url ?? image.path ?? image.src;
  }
}

import { NgClass } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { LucideEye, LucideHeart, LucideShoppingCart, LucideStar } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { UiCardProduct } from './ui-card-product.model';

@Component({
  selector: 'app-ui-card',
  imports: [NgClass, LucideEye, LucideHeart, LucideShoppingCart, LucideStar, TranslatePipe],
  templateUrl: './ui-card.html',
})
export class UiCard {
  product = input<UiCardProduct | null>(null);
  imageAspect = input('aspect-[1/0.9]');

  wishlistClick = output<void>();
  viewClick = output<void>();
  cartClick = output<void>();

  readonly stars = [1, 2, 3, 4, 5];
  readonly fallbackImage = '/logos/rose-logo.png';

  readonly isOutOfStock = computed(() => {
    const item = this.product();
    return item?.isOutOfStock ?? (item?.stock ?? 1) <= 0;
  });

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

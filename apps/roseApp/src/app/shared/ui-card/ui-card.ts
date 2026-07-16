import { NgClass } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { LucideEye, LucideHeart, LucideShoppingCart, LucideStar } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { WishlistActionsService } from '../../features/wishlist/services/wishlist-actions.service';
import { UiCardProduct } from './ui-card-product.model';
import { CartService } from '../../core/services/cart.service';
import { AuthSessionService } from '@org/auth-data-access';

@Component({
  selector: 'app-ui-card',
  imports: [
    NgClass,
    LucideEye,
    LucideHeart,
    LucideShoppingCart,
    LucideStar,
    TranslatePipe,
  ],
  templateUrl: './ui-card.html',
})
export class UiCard {
  private readonly wishlistActions = inject(WishlistActionsService);

  product = input<UiCardProduct | null>(null);
  imageAspect = input('aspect-[1/0.9]');

  wishlistClick = output<void>();
  viewClick = output<void>();
  cartClick = output<void>();

  private readonly cartService = inject(CartService);
  private readonly authSession = inject(AuthSessionService);
  readonly isAuthenticated = this.authSession.isAuthenticated;

  handleCartClick(event: Event) {
    event.stopPropagation();
    const item = this.product();
    if (item && item.id) {
      this.cartService.addToCart({ productId: item.id, quantity: 1 });
    }
    this.cartClick.emit();
  }

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

  addToWishlist(event: Event, product: UiCardProduct): void {
    event.stopPropagation();
    this.wishlistActions.addProduct(product.id);
    this.wishlistClick.emit();
  }

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.src = this.fallbackImage;
  }
}

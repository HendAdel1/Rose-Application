import {
  ChangeDetectionStrategy,
  Component,
  signal,
  model,
  input,
  computed,
  inject,
} from '@angular/core';
import {
  LucideStar,
  LucideHeart,
  LucideShoppingCart,
  LucidePackage,
} from '@lucide/angular';
import { CustomButton } from '../../../../shared/custom-button/custom-button';
import { GalleriaModule } from 'primeng/galleria';
import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { ProductApiItem } from '../../../../shared/products/models/product-api-item.model';
import { WishlistActionsService } from '../../../wishlist/services/wishlist-actions.service';

export interface ProductImage {
  itemImageSrc: string;
  thumbnailImageSrc: string;
  alt: string;
  title: string;
}

import { TranslatePipe } from '@ngx-translate/core';
import { AuthSessionService } from '@org/auth-data-access';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-product-info',
  imports: [
    GalleriaModule,
    CustomButton,
    LucideStar,
    LucideHeart,
    LucideShoppingCart,
    LucidePackage,
    TranslatePipe,
    DecimalPipe,
  ],
  templateUrl: './product-info.html',
  styleUrl: './product-info.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductInfo {
  private readonly wishlistActions = inject(WishlistActionsService);
  private readonly authSession = inject(AuthSessionService);
  private readonly cartService = inject(CartService);
  readonly isAuthenticated = this.authSession.isAuthenticated;

  readonly product = input.required<ProductApiItem>();

  readonly productTitle = computed(() => this.product().title);

  // Calculate old price if there is a discount, else return null or current price.
  // The API just returns `price`, `discountType`, `discountValue`.
  readonly oldPrice = computed(() => {
    const p = this.product();
    if (!p.discountValue || p.discountValue === '0') return null;
    const priceNum = this.toNumber(p.price);
    const discountNum = this.toNumber(p.discountValue);
    if (p.discountType === 'PERCENT') {
      return parseFloat((priceNum / (1 - discountNum / 100)).toFixed(2));
    } else {
      return parseFloat((priceNum + discountNum).toFixed(2));
    }
  });

  readonly currentPrice = computed(() => this.toNumber(this.product().price));
  readonly currency = signal('EGP');
  readonly stock = computed(() => this.product().stock);
  readonly rating = computed(() => this.product().rating);
  readonly ratingCount = computed(() => this.product().ratings);
  readonly description = computed(() => this.product().description);

  readonly images = computed<ProductImage[]>(() => {
    const p = this.product();
    let galleryUrls: string[] = [];
    try {
      if (p.gallery) {
        galleryUrls = JSON.parse(p.gallery);
      }
    } catch {
      // ignore
    }

    if (!galleryUrls.length && p.cover) {
      galleryUrls = [p.cover];
    }

    return galleryUrls.map((url, i) => ({
      itemImageSrc: url,
      thumbnailImageSrc: url,
      alt: `${p.title} image ${i + 1}`,
      title: p.title,
    }));
  });

  readonly responsiveOptions: { breakpoint: string; numVisible: number }[] = [
    {
      breakpoint: '1024px',
      numVisible: 6,
    },
    {
      breakpoint: '768px',
      numVisible: 4,
    },
    {
      breakpoint: '560px',
      numVisible: 3,
    },
  ];

  formatPrice(price: number | null): string {
    if (price === null || Number.isNaN(price)) {
      return '';
    }

    return price.toFixed(2);
  }

  addToWishlist(): void {
    this.wishlistActions.addProduct(this.product().id);
  }
  addToCart(): void {
    const p = this.product();
    this.cartService.addToCart({ productId: p.id, quantity: 1 });
  }

  private toNumber(value: string | number): number {
    return typeof value === 'number' ? value : Number.parseFloat(value);
  }
}

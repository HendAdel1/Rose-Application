import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, take } from 'rxjs';
import { WishlistItem } from '../models/wishlist-item.model';
import { WishlistService } from './wishlist.service';

interface WishlistProductSnapshot {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  oldPrice?: number | null;
  rating: number;
  stock?: number;
  isOutOfStock?: boolean;
}

@Injectable({ providedIn: 'root' })
export class WishlistActionsService {
  private readonly wishlistService = inject(WishlistService);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);

  addProduct(product: string | WishlistProductSnapshot): void {
    const productId = typeof product === 'string' ? product : product.id;
    const wishlistItem = typeof product === 'string' ? undefined : this.toWishlistItem(product);

    this.wishlistService
      .addProduct(productId, wishlistItem)
      .pipe(
        take(1),
        catchError(() => EMPTY),
      )
      .subscribe((status) => {
        if (status === 'duplicate') {
          this.toastr.warning(this.translate.instant('WISHLIST.ALREADY_EXISTS'));
          return;
        }

        this.toastr.success(this.translate.instant('WISHLIST.ADD_SUCCESS'));
      });
  }

  private toWishlistItem(product: WishlistProductSnapshot): WishlistItem {
    return {
      id: product.id,
      title: product.title,
      imageUrl: product.imageUrl,
      price: product.price,
      oldPrice: product.oldPrice ?? undefined,
      rating: product.rating,
      ratingsCount: 0,
      inStock: !(product.isOutOfStock ?? false) && (product.stock ?? 1) > 0,
    };
  }
}

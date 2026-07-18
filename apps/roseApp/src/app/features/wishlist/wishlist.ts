import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { LucideArrowLeft, LucideBrushCleaning, LucideFolderHeart, LucideX } from '@lucide/angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, finalize, take } from 'rxjs';
import { WishlistEmptyState } from './components/wishlist-empty-state/wishlist-empty-state';
import { WishlistItem } from './components/wishlist-item/wishlist-item';
import { WishlistService } from './services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  imports: [
    LucideArrowLeft,
    LucideBrushCleaning,
    LucideFolderHeart,
    LucideX,
    RouterLink,
    TranslatePipe,
    WishlistEmptyState,
    WishlistItem,
  ],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Wishlist {
  private readonly wishlistService = inject(WishlistService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);

  readonly items = this.wishlistService.items;
  readonly count = this.wishlistService.count;
  readonly isLoading = signal(false);
  readonly removingItemId = signal<string | null>(null);
  readonly isClearDialogOpen = signal(false);
  readonly isClearing = signal(false);

  constructor() {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading.set(true);

    this.wishlistService
      .getWishlist()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (items) => this.wishlistService.setItems(items),
      });
  }

  openClearConfirmation(): void {
    if (this.count() === 0) {
      return;
    }

    this.isClearDialogOpen.set(true);
  }

  closeClearConfirmation(): void {
    if (this.isClearing()) {
      return;
    }

    this.isClearDialogOpen.set(false);
  }

  confirmClearWishlist(): void {
    if (this.isClearing()) {
      return;
    }

    this.isClearing.set(true);

    this.wishlistService
      .clearWishlist()
      .pipe(
        take(1),
        catchError(() => EMPTY),
        finalize(() => this.isClearing.set(false)),
      )
      .subscribe(() => {
        this.isClearDialogOpen.set(false);
        this.toastr.success(this.translate.instant('WISHLIST.CLEAR_SUCCESS'));
      });
  }

  removeItem(productId: string): void {
    if (this.removingItemId()) {
      return;
    }

    this.removingItemId.set(productId);

    this.wishlistService
      .removeProduct(productId)
      .pipe(
        take(1),
        catchError(() => EMPTY),
        finalize(() => this.removingItemId.set(null)),
      )
      .subscribe(() => {
        this.toastr.success(this.translate.instant('WISHLIST.REMOVE_SUCCESS'));
      });
  }
}

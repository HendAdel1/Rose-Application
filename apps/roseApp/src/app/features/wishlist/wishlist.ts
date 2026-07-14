import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideBrushCleaning, LucideFolderHeart } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { WishlistEmptyState } from './components/wishlist-empty-state/wishlist-empty-state';
import { WishlistItem } from './components/wishlist-item/wishlist-item';
import { WishlistService } from './services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  imports: [LucideBrushCleaning, LucideFolderHeart, TranslatePipe, WishlistEmptyState, WishlistItem],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Wishlist {
  private readonly wishlistService = inject(WishlistService);
  private readonly destroyRef = inject(DestroyRef);

  readonly items = this.wishlistService.items;
  readonly count = this.wishlistService.count;
  readonly isLoading = signal(false);

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
    // The clear action will be wired to a confirmation dialog in the remove task.
  }
}

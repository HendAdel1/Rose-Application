import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideShoppingCart, LucideStar, LucideTrash2 } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { CustomButton } from '../../../../shared/custom-button/custom-button';
import { WishlistItem as WishlistProduct } from '../../models/wishlist-item.model';

@Component({
  selector: 'app-wishlist-item',
  imports: [
    CurrencyPipe,
    CustomButton,
    DecimalPipe,
    LucideShoppingCart,
    LucideStar,
    LucideTrash2,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './wishlist-item.html',
  styleUrl: './wishlist-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistItem {
  readonly item = input.required<WishlistProduct>();
  readonly isRemoving = input(false);
  readonly remove = output<string>();
  readonly addToCart = output<string>();

  onRemove(): void {
    this.remove.emit(this.item().removeId);
  }

  onAddToCart(): void {
    this.addToCart.emit(this.item().id);
  }
}

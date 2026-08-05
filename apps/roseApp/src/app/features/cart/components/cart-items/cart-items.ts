import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnInit,
  effect,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {
  LucideTrash2,
  LucideStar,
  LucideMinus,
  LucidePlus,
  LucideArrowLeft,
} from '@lucide/angular';
import { CustomButton } from '../../../../shared/custom-button/custom-button';
import { CustomInput } from '@org/sharedComponents';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { CartService } from '../../../../core/services/cart.service';

export interface CartItem {
  id: string;
  title: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-cart-items',
  imports: [
    LucideTrash2,
    LucideStar,
    LucideMinus,
    LucidePlus,
    LucideArrowLeft,
    CustomButton,
    CustomInput,
    FormsModule,
    TranslatePipe,
    DecimalPipe,
  ],
  templateUrl: './cart-items.html',
  styleUrl: './cart-items.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItems implements OnInit {
  cartService = inject(CartService);

  cartItems = signal<CartItem[]>([]);

  constructor() {
    effect(
      () => {
        const apiItems = this.cartService.cartItemsAPI();
        this.cartItems.set(
          apiItems.map((apiItem) => ({
            id: apiItem.id,
            title: apiItem.product.title,
            image: apiItem.product.cover,
            rating: apiItem.product.rating,
            reviews: apiItem.product.ratings,
            price: parseFloat(apiItem.product.price),
            quantity: apiItem.quantity,
          })),
        );
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit() {
    this.cartService.fetchCart();
  }

  updateQuantity(id: string, delta: number) {
    const item = this.cartItems().find(i => i.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      if (newQuantity !== item.quantity) {
        this.cartService.updateCartItemQuantity(id, newQuantity);
      }
    }
  }

  setQuantity(id: string, quantity: number) {
    const item = this.cartItems().find(i => i.id === id);
    if (item) {
      const newQuantity = Math.max(1, quantity);
      if (newQuantity !== item.quantity) {
        this.cartService.updateCartItemQuantity(id, newQuantity);
      }
    }
  }

  removeItem(id: string) {
    this.cartService.removeCartItem(id);
  }

  clearCart() {
    this.cartService.clearCart(() => {
      this.cartItems.set([]);
    });
  }
}

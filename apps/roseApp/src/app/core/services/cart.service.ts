import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { signal, computed } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { SKIP_LOADING } from '@org/auth-data-access';
import { environment } from '../../environments/environment';

export interface Product {
  id: string;
  title: string;
  description: string;
  rating: number;
  ratings: number;
  stock: number;
  price: string;
  discountType: string;
  discountValue: string;
  cover: string;
  gallery: string;
  categoryId: string;
  subCategoryId: string;
  immutable: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    title: string;
  };
  subCategory: {
    id: string;
    title: string;
  };
}

export interface CartItemAPI {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

export interface CartResponse {
  status: boolean;
  code: number;
  payload: {
    cartItems: CartItemAPI[];
  };
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

export interface AddToCartResponse {
  status: boolean;
  code: number;
  payload: {
    cartItem: CartItemAPI;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly cartUrl = `${environment.apiBaseUrl}/cart`;
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);

  cartItemsAPI = signal<CartItemAPI[]>([]);
  cartItemCount = new BehaviorSubject<number>(0);

  cartSubtotal = computed(() => {
    return this.cartItemsAPI().reduce((acc, item) => {
      const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : (item.product.price as any);
      return acc + (price * item.quantity);
    }, 0);
  });

  cartTotal = computed(() => {
    // Return subtotal (expandable later if coupons are added)
    return this.cartSubtotal();
  });

  private toast(key: string, fallback: string): string {
    return this.translate.instant(key) || fallback;
  }

  fetchCart() {
    this.http
      .get<CartResponse>(this.cartUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.cartItemsAPI.set(res.payload.cartItems);
          const count = res.payload.cartItems.reduce((acc, item) => acc + item.quantity, 0);
          this.cartItemCount.next(count);
        },
        error: (err) => console.error('Failed to fetch cart', err),
      });
  }

  addToCart(payload: AddToCartPayload, onSuccess?: () => void) {
    this.http
      .post<AddToCartResponse>(this.cartUrl, payload, { context: new HttpContext().set(SKIP_LOADING, true) })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.cartItemCount.next(this.cartItemCount.value + payload.quantity);
          this.toastr.success(this.toast('CART.TOASTS.ADD_SUCCESS', 'Item added to cart successfully!'));
          if (onSuccess) onSuccess();
        },
        error: (err) => {
          console.error('Failed to add to cart', err);
          this.toastr.error(this.toast('CART.TOASTS.ADD_FAILED', 'Failed to add item to cart.'));
        },
      });
  }

  clearCart(onSuccess?: () => void) {
    this.http
      .delete<{ status: boolean; code: number; message: string }>(this.cartUrl, { context: new HttpContext().set(SKIP_LOADING, true) })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this.cartItemsAPI.set([]);
            this.cartItemCount.next(0);
            this.toastr.success(res.message || this.toast('CART.TOASTS.CLEAR_SUCCESS', 'Cart cleared.'));
            if (onSuccess) onSuccess();
          }
        },
        error: (err) => {
          console.error('Failed to clear cart', err);
          this.toastr.error(this.toast('CART.TOASTS.CLEAR_FAILED', 'Failed to clear cart.'));
        },
      });
  }

  removeCartItem(cartItemId: string, onSuccess?: () => void) {
    this.http
      .delete<{ status: boolean; code: number; message: string }>(`${this.cartUrl}/${cartItemId}`, { context: new HttpContext().set(SKIP_LOADING, true) })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this.cartItemsAPI.update(items => items.filter(item => item.id !== cartItemId));
            const newCount = this.cartItemsAPI().reduce((acc, item) => acc + item.quantity, 0);
            this.cartItemCount.next(newCount);
            
            this.toastr.success(res.message || this.toast('CART.TOASTS.REMOVE_SUCCESS', 'Item removed from cart.'));
            if (onSuccess) onSuccess();
          }
        },
        error: (err) => {
          console.error('Failed to remove cart item', err);
          this.toastr.error(this.toast('CART.TOASTS.REMOVE_FAILED', 'Failed to remove item.'));
        },
      });
  }

  updateCartItemQuantity(cartItemId: string, quantity: number, onSuccess?: (updatedItem: CartItemAPI) => void) {
    this.http
      .patch<{ status: boolean; code: number; payload: { cartItem: CartItemAPI } }>(
        `${this.cartUrl}/${cartItemId}`,
        { quantity },
        { context: new HttpContext().set(SKIP_LOADING, true) }
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.status && res.payload?.cartItem) {
            // Update the local list
            this.cartItemsAPI.update((items) =>
              items.map((item) => (item.id === cartItemId ? res.payload.cartItem : item))
            );
            // Recalculate total count
            const newCount = this.cartItemsAPI().reduce((acc, item) => acc + item.quantity, 0);
            this.cartItemCount.next(newCount);

            this.toastr.success(this.toast('CART.TOASTS.UPDATE_SUCCESS', 'Cart item updated.'));
            if (onSuccess) onSuccess(res.payload.cartItem);
          }
        },
        error: (err) => {
          console.error('Failed to update cart item quantity', err);
          this.toastr.error(this.toast('CART.TOASTS.UPDATE_FAILED', 'Failed to update quantity.'));
        },
      });
  }
}

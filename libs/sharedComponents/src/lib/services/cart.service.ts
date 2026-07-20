import { HttpClient } from '@angular/common/http';
import { Injectable, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { signal } from '@angular/core';
import { environment } from '../../../../../apps/roseApp/src/app/environments/environment';

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
  providedIn: 'root'
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly cartUrl = `${environment.apiBaseUrl}/cart`;
  private readonly destroyRef = inject(DestroyRef);

  cartItemsAPI = signal<CartItemAPI[]>([]);

  fetchCart() {
    this.http.get<CartResponse>(this.cartUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.cartItemsAPI.set(res.payload.cartItems);
        },
        error: (err) => console.error('Failed to fetch cart', err)
      });
  }

  addToCart(payload: AddToCartPayload, onSuccess?: () => void) {
    this.http.post<AddToCartResponse>(this.cartUrl, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.fetchCart();
          if (onSuccess) onSuccess();
        },
        error: (err) => console.error('Failed to add to cart', err)
      });
  }
}

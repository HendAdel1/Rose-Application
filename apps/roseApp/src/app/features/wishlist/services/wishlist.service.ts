import { HttpClient, HttpContext } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { SKIP_LOADING } from '@org/auth-data-access';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { toWishlistItems } from '../mappers/wishlist.mapper';
import { WishlistItem } from '../models/wishlist-item.model';
import { WishlistResponse } from '../models/wishlist-response.model';

export type WishlistAddStatus = 'added' | 'duplicate';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly http = inject(HttpClient);
  private readonly wishlistUrl = `${environment.apiBaseUrl}/wishlist`;
  private readonly wishlistItems = signal<WishlistItem[]>([]);
  private readonly wishlistLoaded = signal(false);

  readonly items = this.wishlistItems.asReadonly();
  readonly count = computed(() => this.items().length);

  getWishlist(): Observable<WishlistItem[]> {
    return this.http
      .get<WishlistResponse>(this.wishlistUrl, this.skipLoadingOptions())
      .pipe(map((response) => toWishlistItems(response.payload)));
  }

  loadWishlist(): Observable<WishlistItem[]> {
    return this.getWishlist().pipe(tap((items) => this.setItems(items)));
  }

  addProduct(
    productId: string,
    fallbackItem?: WishlistItem,
  ): Observable<WishlistAddStatus> {
    const addToWishlist = () => {
      if (this.hasItem(productId)) {
        return of('duplicate' as const);
      }

      const request = this.http.post(
        this.wishlistUrl,
        { productId },
        this.skipLoadingOptions(),
      );

      if (fallbackItem) {
        return request.pipe(
          tap(() =>
            this.setItems(this.resolveAddedItems(this.items(), fallbackItem)),
          ),
          map(() => 'added' as const),
        );
      }

      return request.pipe(
        switchMap(() => this.getWishlist()),
        tap((items) => this.setItems(items)),
        map(() => 'added' as const),
      );
    };

    if (this.wishlistLoaded()) {
      return addToWishlist();
    }

    return this.loadWishlist().pipe(switchMap(addToWishlist));
  }

  removeProduct(productId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.wishlistUrl}/${productId}`,
      this.skipLoadingOptions(),
    ).pipe(
      tap(() => {
        this.wishlistItems.update((items) =>
          items.filter(
            (item) => item.removeId !== productId && item.id !== productId,
          ),
        );
        this.wishlistLoaded.set(true);
      }),
    );
  }

  clearWishlist(): Observable<void> {
    return this.http.delete<void>(
      this.wishlistUrl,
      this.skipLoadingOptions(),
    ).pipe(
      tap(() => {
        this.wishlistItems.set([]);
        this.wishlistLoaded.set(true);
      }),
    );
  }

  hasItem(productId: string): boolean {
    return this.wishlistItems().some((item) => item.id === productId);
  }

  setItems(items: WishlistItem[]): void {
    this.wishlistItems.set(items.filter((item) => item.id));
    this.wishlistLoaded.set(true);
  }

  private resolveAddedItems(
    items: WishlistItem[],
    fallbackItem?: WishlistItem,
  ): WishlistItem[] {
    if (!fallbackItem || items.some((item) => item.id === fallbackItem.id)) {
      return items;
    }

    return [fallbackItem, ...items];
  }

  private skipLoadingOptions(): { context: HttpContext } {
    return {
      context: new HttpContext().set(SKIP_LOADING, true),
    };
  }
}

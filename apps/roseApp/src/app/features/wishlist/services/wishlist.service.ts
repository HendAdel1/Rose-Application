import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { toWishlistItems } from '../mappers/wishlist.mapper';
import { WishlistItem } from '../models/wishlist-item.model';
import { WishlistResponse } from '../models/wishlist-response.model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly http = inject(HttpClient);
  private readonly wishlistUrl = `${environment.apiBaseUrl}/wishlist`;
  private readonly wishlistItems = signal<WishlistItem[]>([]);

  readonly items = this.wishlistItems.asReadonly();
  readonly count = computed(() => this.items().length);

  getWishlist(): Observable<WishlistItem[]> {
    return this.http
      .get<WishlistResponse>(this.wishlistUrl)
      .pipe(map((response) => toWishlistItems(response.payload)));
  }

  setItems(items: WishlistItem[]): void {
    this.wishlistItems.set(items);
  }
}

import {
  buildProductImageUrl,
} from '../../../shared/products/utils/product-card.utils';
import { ProductApiItem } from '../../../shared/products/models/product-api-item.model';
import {
  WishlistApiItem,
  WishlistPayload,
} from '../models/wishlist-response.model';
import { WishlistItem } from '../models/wishlist-item.model';

export function toWishlistItems(payload: WishlistPayload): WishlistItem[] {
  return extractWishlistEntries(payload).map(toWishlistItem);
}

function extractWishlistEntries(payload: WishlistPayload): WishlistApiItem[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload.data ?? payload.items ?? payload.wishlist ?? [];
}

function toWishlistItem(item: WishlistApiItem): WishlistItem {
  const product = getWishlistProduct(item);

  return {
    id: product.id ?? '',
    title: product.title ?? '',
    imageUrl: buildProductImageUrl(product.cover),
    price: getCurrentPrice(product),
    oldPrice: getOldPrice(product),
    rating: product.rating ?? 0,
    ratingsCount: product.ratings ?? 0,
    inStock: (product.stock ?? 0) > 0,
  };
}

function getWishlistProduct(item: WishlistApiItem): Partial<ProductApiItem> {
  return item.product ?? item;
}

function getCurrentPrice(product: Partial<ProductApiItem>): number {
  return Number(product.price ?? 0);
}

function getOldPrice(product: Partial<ProductApiItem>): number | undefined {
  const currentPrice = getCurrentPrice(product);
  const discountValue = Number(product.discountValue ?? 0);

  if (!discountValue) {
    return undefined;
  }

  const oldPrice =
    product.discountType === 'PERCENT'
      ? currentPrice / (1 - discountValue / 100)
      : currentPrice + discountValue;

  return oldPrice > currentPrice ? oldPrice : undefined;
}

import { ProductApiItem } from '../../../shared/products/models/product-api-item.model';

export interface WishlistResponse {
  status: boolean;
  code: number;
  message: string;
  payload: WishlistPayload;
}

export type WishlistPayload =
  | WishlistApiItem[]
  | {
      data?: WishlistApiItem[];
      items?: WishlistApiItem[];
      products?: WishlistApiItem[];
      wishlist?: WishlistApiItem[];
      wishlistItems?: WishlistApiItem[];
    };

export interface WishlistApiItem extends Partial<ProductApiItem> {
  product?: ProductApiItem;
  productId?: string;
  productData?: ProductApiItem;
  productDetails?: ProductApiItem;
}

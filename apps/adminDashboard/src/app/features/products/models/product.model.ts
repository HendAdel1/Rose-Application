import { ProductApiItem } from './product-api.model';

/**
 * Product UI model used by the admin dashboard reusable table.
 */
export interface Product extends Record<string, unknown> {
  id: string;
  name: string;
  price: number;
  stock: number;
  sales: number;
  rating: number;
  maxRating: number;
  reviewCount: number;
  cover: string;
  categoryTitle: string;
  discountType: string | null;
  discountValue: string | null;
  raw: ProductApiItem;
}

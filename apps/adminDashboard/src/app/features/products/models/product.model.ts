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
  deletedAt?: string | null;
  raw: ProductApiItem;
}

export interface CreateProductPayload {
  title: string;
  description: string;
  price: number;
  stock: number;
  discountType?: 'PERCENT' | 'FIXED' | null;
  discountValue?: number | null;
  cover: string;
  gallery?: string[];
  categoryId: string;
  subCategoryId?: string | null;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;



import { ProductCategory } from './product-category.model';
import { ProductCount } from './product-count.model';
import { ProductReview } from './product-review.model';
import { ProductSubCategory } from './product-sub-category.model';

export interface ProductApiItem {
  id: string;
  title: string;
  description: string;
  rating: number;
  ratings: number;
  stock: number;
  price: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: string;
  cover: string;
  gallery: string;
  categoryId: string;
  subCategoryId: string | null;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
  category: ProductCategory | null;
  subCategory: ProductSubCategory | null;
  occasions: unknown[];
  reviews?: ProductReview[];
  _count: ProductCount;
}

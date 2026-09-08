/**
 * Raw API Response Models for GET /api/products
 */

export interface ProductApiCount {
  reviews: number;
  cartItems: number;
  wishlistItems: number;
  orderItems: number;
}

export interface ProductCategoryRef {
  id: string;
  title: string;
}

export interface ProductSubCategoryRef {
  id: string;
  title: string;
}

export interface ProductOccasionItem {
  id: string;
  productId: string;
  occasionId: string;
  createdAt: string;
  occasion?: {
    id: string;
    title: string;
    description?: string;
    image?: string;
    immutable?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface ProductApiItem {
  id: string;
  title: string;
  description: string;
  rating: number;
  ratings: number;
  stock: number;
  price: string;
  discountType: string | null;
  discountValue: string | null;
  cover: string;
  gallery: string;
  categoryId: string;
  subCategoryId: string | null;
  immutable: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: ProductCategoryRef | null;
  subCategory: ProductSubCategoryRef | null;
  occasions: ProductOccasionItem[];
  _count: ProductApiCount;
}

export interface ProductApiMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductApiPayload {
  data: ProductApiItem[];
  metadata: ProductApiMetadata;
}

export interface ProductApiResponse {
  status: boolean;
  code: number;
  payload: ProductApiPayload;
}

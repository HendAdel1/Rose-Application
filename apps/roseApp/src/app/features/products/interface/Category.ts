export interface SubCategory {
  id: string;
  title: string;
}

export interface CategoryProductsCount {
  products: number;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  image: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
  subCategories: SubCategory[];
  _count: CategoryProductsCount;
}

export interface CategoriesApiResponse {
  message?: string;
  metadata?: {
    currentPage: number;
    totalPages: number;
    limit: number;
    totalItems: number;
  };
  categories?: Category[];
  payload?: {
    categories: Category[];
  };
}

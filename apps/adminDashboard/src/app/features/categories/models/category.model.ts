export interface ApiResponse<TPayload = unknown> {
  status: boolean;
  code: number;
  message?: string;
  payload?: TPayload;
}

export interface CategoryDto {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  immutable?: boolean;
  createdAt?: string;
  updatedAt?: string;
  subCategories?: { id: string; title: string }[];
  productCount?: number;
  _count?: { products?: number; subCategories?: number };
}

export interface CategoriesListPayload {
  data?: CategoryDto[];
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    currentPage?: number;
    totalItems?: number;
  };
}

export interface CreateCategoryPayload {
  title: string;
  description?: string;
  image?: string;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export interface UploadPayload {
  url: string;
}

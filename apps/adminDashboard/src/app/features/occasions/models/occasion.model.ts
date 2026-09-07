export interface Occasion {
  _id?: string;
  id?: string;
  title: string;
  slug?: string;
  description?: string;
  image?: string;
  productsCount?: number;
  productCount?: number;
  immutable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OccasionsMetadata {
  currentPage: number;
  totalPages: number;
  limit: number;
  totalItems: number;
}

export interface OccasionsApiResponse {
  status?: boolean;
  code?: number;
  message?: string;
  metadata?: OccasionsMetadata;
  occasions?: Occasion[];
  payload?: {
    occasions?: Occasion[];
    data?: Occasion[];
    metadata?: OccasionsMetadata;
    total?: number;
    currentPage?: number;
    totalPages?: number;
  };
}

export interface OccasionsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateOccasionDto {
  title: string;
  description?: string;
  image: string;
}

export interface UpdateOccasionDto {
  title?: string;
  description?: string;
  image?: string;
}

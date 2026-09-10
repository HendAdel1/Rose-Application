export interface OccasionDto {
  _id?: string;
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  image?: string;
  productsCount?: number;
  productCount?: number;
  _count?: {
    products?: number;
  };
  immutable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OccasionMetadata {
  currentPage?: number;
  totalPages?: number;
  page?: number;
  limit?: number;
  total?: number;
  totalItems?: number;
}

export interface OccasionsListPayload {
  occasions?: OccasionDto[];
  data?: OccasionDto[];
  metadata?: OccasionMetadata;
}

export interface CreateOccasionPayload {
  title: string;
  image: string;
  description?: string;
}

export interface UpdateOccasionPayload {
  title?: string;
  image?: string;
  description?: string;
}

export interface ApiResponse<T> {
  status?: boolean | string;
  message?: string;
  payload?: T;
  data?: T;
}

export interface UploadPayload {
  url?: string;
}

export type Occasion = OccasionDto;
export type OccasionsMetadata = OccasionMetadata;
export type CreateOccasionDto = CreateOccasionPayload;
export type UpdateOccasionDto = UpdateOccasionPayload;

export interface ReviewUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface ReviewProduct {
  id: string;
  title: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  headline: string;
  content: string;
  rating: number; // 1 -> 5
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
  product: ReviewProduct;
}

export interface ReviewsApiResponse {
  message?: string;
  metadata?: {
    currentPage: number;
    totalPages: number;
    limit: number;
    total: number;
  };
  reviews?: Review[];
  data?: Review[];
}
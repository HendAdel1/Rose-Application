export interface ProductReviewUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface ProductReview {
  id: string;
  userId: string;
  productId: string;
  headline: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: ProductReviewUser;
}

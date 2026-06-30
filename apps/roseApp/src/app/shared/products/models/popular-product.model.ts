export interface PopularProduct {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  categoryTitle: string;
  isOutOfStock: boolean;
}

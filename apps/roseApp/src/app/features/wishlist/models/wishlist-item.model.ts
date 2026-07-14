export interface WishlistItem {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  oldPrice?: number;
  rating: number;
  ratingsCount: number;
  inStock: boolean;
}

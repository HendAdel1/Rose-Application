export interface WishlistItem {
  id: string;
  removeId: string;
  title: string;
  imageUrl: string;
  price: number;
  oldPrice?: number;
  rating: number;
  ratingsCount: number;
  inStock: boolean;
}

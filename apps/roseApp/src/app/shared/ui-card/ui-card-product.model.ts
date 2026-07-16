export interface UiCardProduct {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  oldPrice?: number | null;
  rating: number;
  stock?: number;
  isOutOfStock?: boolean;
}

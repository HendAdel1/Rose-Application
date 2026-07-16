export interface Product {
  _id?: string;
  id?: string;
  title: string;
  name?: string;
  description?: string;
  price: number;
  finalPrice?: number;
  priceAfterDiscount?: number;
  discountPrice?: number;
  discountValue?: number;
  discountType?: string;
  stock?: number;
  sold?: number;
  cover?: string;
  image?: string;
  picture?: string;
  thumbnail?: string;
  imageCover?: string;
  imgCover?: string;
  gallery?: string[] | ProductImage[];
  images?: string[] | ProductImage[];
  ratingsAverage?: number;
  rateAvg?: number;
  rating?: number;
  ratingsQuantity?: number;
}

export interface ProductImage {
  url?: string;
  secure_url?: string;
  path?: string;
  src?: string;
}

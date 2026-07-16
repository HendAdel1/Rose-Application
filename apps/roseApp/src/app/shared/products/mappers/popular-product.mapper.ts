import { PopularProduct } from '../models/popular-product.model';
import { ProductApiItem } from '../models/product-api-item.model';
import { buildProductImageUrl } from '../utils/product-card.utils';

export function toMostPopularProducts(
  products: ProductApiItem[],
  limit: number,
): PopularProduct[] {
  return products
    .map(toPopularProduct)
    .sort(
      (first, second) =>
        getPopularityScore(second) - getPopularityScore(first),
    )
    .slice(0, limit);
}

function toPopularProduct(product: ProductApiItem): PopularProduct {
  const price = Number(product.price);
  const discountValue = Number(product.discountValue);
  const oldPrice =
    product.discountType === 'PERCENT'
      ? price / (1 - discountValue / 100)
      : price + discountValue;

  return {
    id: product.id,
    title: product.title,
    imageUrl: buildProductImageUrl(product.cover),
    price,
    oldPrice,
    rating: product.rating,
    reviewsCount: product.ratings,
    stock: product.stock,
    categoryTitle: product.category?.title ?? '',
    isOutOfStock: product.stock <= 0,
  };
}

function getPopularityScore(product: PopularProduct): number {
  return product.rating * 10 + product.reviewsCount;
}

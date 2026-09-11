import { ProductApiItem } from '../models/product-api.model';
import { Product } from '../models/product.model';

/**
 * Mapper responsible for transforming raw Product API DTOs into clean UI models.
 */
export class ProductMapper {
  /**
   * Maps a single ProductApiItem DTO into a Product UI model.
   *
   * @param item - Raw product DTO from GET /api/products
   */
  static toUiModel(item: ProductApiItem): Product {
    return {
      id: item.id,
      name: item.title,
      price: Number(item.price) || 0,
      stock: item.stock ?? 0,
      sales: item._count?.orderItems ?? 0,
      rating: item.rating ?? 0,
      maxRating: 5,
      reviewCount: item._count?.reviews ?? item.ratings ?? 0,
      cover: item.cover,
      categoryTitle: item.category?.title ?? '',
      discountType: item.discountType,
      discountValue: item.discountValue,
      deletedAt: item.deletedAt,
      raw: item,
    };
  }

  /**
   * Maps an array of ProductApiItem DTOs into Product UI models.
   *
   * @param items - Array of raw product DTOs
   */
  static toUiModelList(items: ProductApiItem[]): Product[] {
    if (!items || !Array.isArray(items)) {
      return [];
    }
    return items.map((item) => this.toUiModel(item));
  }
}

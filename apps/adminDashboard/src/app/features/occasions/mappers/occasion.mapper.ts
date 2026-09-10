import { OccasionDto } from '../models/occasion.model';
import { OccasionRow } from '../models/occasion-row.model';

export class OccasionMapper {
  static toUiModel(item: OccasionDto): OccasionRow {
    const id = item.id || item._id || '';
    return {
      id,
      name: item.title ?? '',
      products: item.productsCount ?? item.productCount ?? item._count?.products ?? 0,
      description: item.description ?? '',
      image: item.image ?? '',
      immutable: item.immutable ?? false,
      raw: item,
    };
  }

  static toUiModelList(items: OccasionDto[]): OccasionRow[] {
    if (!items || !Array.isArray(items)) {
      return [];
    }
    return items.map((item) => this.toUiModel(item));
  }
}

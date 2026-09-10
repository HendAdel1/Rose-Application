import { CategoryDto } from '../models/category.model';
import { CategoryRow } from '../models/category-row.model';

export class CategoryMapper {
  static toUiModel(item: CategoryDto): CategoryRow {
    return {
      id: item.id,
      name: item.title ?? '',
      products: item._count?.products ?? item.productCount ?? 0,
      description: item.description ?? '',
      image: item.image ?? '',
      immutable: item.immutable ?? false,
      raw: item,
    };
  }

  static toUiModelList(items: CategoryDto[]): CategoryRow[] {
    if (!items || !Array.isArray(items)) {
      return [];
    }
    return items.map((item) => this.toUiModel(item));
  }
}

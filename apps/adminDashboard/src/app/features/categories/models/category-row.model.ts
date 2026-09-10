import { CategoryDto } from './category.model';

export interface CategoryRow extends Record<string, unknown> {
  id: string;
  name: string;
  products: number;
  description: string;
  image: string;
  immutable: boolean;
  raw: CategoryDto;
}

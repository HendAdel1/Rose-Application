import { OccasionDto } from './occasion.model';

export interface OccasionRow {
  id: string;
  name: string;
  products: number;
  description?: string;
  image?: string;
  immutable?: boolean;
  raw?: OccasionDto;
  [key: string]: unknown;
}

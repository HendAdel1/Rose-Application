import { Product } from './product.model';

export interface ProductsPayload {
  products?: Product[];
  data?: Product[];
  items?: Product[];
  docs?: Product[];
  documents?: Product[];
  results?: Product[];
}

export interface ProductsResponse {
  status?: boolean;
  code?: number;
  message?: string;
  payload?: Product[] | ProductsPayload;
  data?: Product[];
  products?: Product[];
  items?: Product[];
  docs?: Product[];
  documents?: Product[];
  results?: Product[];
}

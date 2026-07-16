import { ProductApiItem } from './product-api-item.model';

export interface ProductDetailsResponse {
  status: boolean;
  code: number;
  message?: string;
  payload: {
    product: ProductApiItem;
  };
}

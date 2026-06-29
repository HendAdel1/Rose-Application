import { ProductsPayload } from './products-payload.model';

export interface ProductsResponse {
  status: boolean;
  code: number;
  message?: string;
  payload: ProductsPayload;
}

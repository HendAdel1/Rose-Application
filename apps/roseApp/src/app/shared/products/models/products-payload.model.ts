import { ProductApiItem } from './product-api-item.model';
import { ProductsMetadata } from './products-metadata.model';

export interface ProductsPayload {
  data: ProductApiItem[];
  metadata: ProductsMetadata;
}

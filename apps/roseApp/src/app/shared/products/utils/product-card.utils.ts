import { environment } from '../../../environments/environment';
import { UiCardProduct } from '../../ui-card/ui-card-product.model';
import { ProductApiItem } from '../models/product-api-item.model';

const fallbackImage = '/logos/rose-logo.png';

export function buildProductImageUrl(path?: string): string {
  if (!path) {
    return fallbackImage;
  }

  if (path.startsWith('http')) {
    return path;
  }

  if (path.startsWith('/images/') || path.startsWith('/logos/')) {
    return path;
  }

  const origin = environment.apiBaseUrl.replace(/\/api$/, '');

  return path.startsWith('/') ? `${origin}${path}` : `${origin}/${path}`;
}

export function getProductCurrentPrice(product: ProductApiItem): number {
  return Number(product.price ?? 0);
}

export function getProductOldPrice(product: ProductApiItem): number | null {
  const currentPrice = getProductCurrentPrice(product);
  const discountValue = Number(product.discountValue ?? 0);

  if (!discountValue) {
    return null;
  }

  const oldPrice =
    product.discountType === 'PERCENT'
      ? currentPrice / (1 - discountValue / 100)
      : currentPrice + discountValue;

  return oldPrice > currentPrice ? oldPrice : null;
}

export function toUiCardProduct(product: ProductApiItem): UiCardProduct {
  return {
    id: product.id,
    title: product.title,
    imageUrl: buildProductImageUrl(product.cover),
    price: getProductCurrentPrice(product),
    oldPrice: getProductOldPrice(product),
    rating: product.rating ?? 4,
    stock: product.stock,
    isOutOfStock: (product.stock ?? 0) <= 0,
  };
}

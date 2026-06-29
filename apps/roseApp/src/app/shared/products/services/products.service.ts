import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PopularProduct } from '../models/popular-product.model';
import { ProductApiItem } from '../models/product-api-item.model';
import { ProductsResponse } from '../models/products-response.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly productsUrl = `${environment.apiBaseUrl}/products`;

  getProducts(): Observable<ProductApiItem[]> {
    return this.http
      .get<ProductsResponse>(this.productsUrl)
      .pipe(map((response) => response.payload.data));
  }

  getMostPopularProducts(limit = 8): Observable<PopularProduct[]> {
    return this.getProducts().pipe(
      map((products) =>
        products
          .map((product) => this.mapToPopularProduct(product))
          .sort(
            (first, second) =>
              this.getPopularityScore(second) - this.getPopularityScore(first),
          )
          .slice(0, limit),
      ),
    );
  }

  private mapToPopularProduct(product: ProductApiItem): PopularProduct {
    const price = Number(product.price);
    const discountValue = Number(product.discountValue);
    const oldPrice =
      product.discountType === 'PERCENT'
        ? price / (1 - discountValue / 100)
        : price + discountValue;

    return {
      id: product.id,
      title: product.title,
      imageUrl: product.cover,
      price,
      oldPrice,
      rating: product.rating,
      reviewsCount: product.ratings,
      stock: product.stock,
      categoryTitle: product.category?.title ?? '',
      isOutOfStock: product.stock <= 0,
    };
  }

  private getPopularityScore(product: PopularProduct): number {
    return product.rating * 10 + product.reviewsCount;
  }
}

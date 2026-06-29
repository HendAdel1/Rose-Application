import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductImage } from '../models/product.model';
import { ProductsPayload, ProductsResponse } from '../models/products-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getProducts(limit = 8): Observable<Product[]> {
    const params = new HttpParams().set('limit', limit);

    return this.http
      .get<ProductsResponse | Product[]>(`${this.apiUrl}/products`, { params })
      .pipe(map((response) => this.extractProducts(response).map((product) => this.normalizeProduct(product))));
  }

  buildImageUrl(path?: string): string {
    if (!path) {
      return '/logos/rose-logo.png';
    }

    if (path.startsWith('http')) {
      return path;
    }

    if (path.startsWith('/images/') || path.startsWith('/logos/')) {
      return path;
    }

    const origin = this.apiUrl.replace(/\/api$/, '');

    return path.startsWith('/') ? `${origin}${path}` : `${origin}/${path}`;
  }

  private extractProducts(response: ProductsResponse | Product[]): Product[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response.payload)) {
      return response.payload;
    }

    const payload = response.payload as ProductsPayload | undefined;

    return (
      payload?.products ??
      payload?.data ??
      payload?.items ??
      payload?.docs ??
      payload?.documents ??
      payload?.results ??
      response.products ??
      response.data ??
      response.items ??
      response.docs ??
      response.documents ??
      response.results ??
      []
    );
  }

  private normalizeProduct(product: Product): Product {
    const price = Number(product.price ?? 0);
    const discountValue = Number(product.discountValue ?? 0);
    const priceAfterDiscount =
      product.priceAfterDiscount ??
      product.discountPrice ??
      product.finalPrice ??
      (discountValue ? price - discountValue : undefined);

    return {
      ...product,
      title: product.title ?? product.name ?? 'Rose Product',
      price,
      priceAfterDiscount,
      cover: this.pickImage(product),
      ratingsAverage: product.ratingsAverage ?? product.rateAvg ?? product.rating ?? 4,
    };
  }

  private pickImage(product: Product): string | undefined {
    return (
      product.cover ??
      product.imageCover ??
      product.imgCover ??
      product.image ??
      product.picture ??
      product.thumbnail ??
      this.readImage(product.gallery?.[0]) ??
      this.readImage(product.images?.[0])
    );
  }

  private readImage(image?: string | ProductImage): string | undefined {
    if (!image) {
      return undefined;
    }

    if (typeof image === 'string') {
      return image;
    }

    return image.url ?? image.secure_url ?? image.path ?? image.src;
  }
}

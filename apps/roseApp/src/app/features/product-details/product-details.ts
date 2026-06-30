import { Component } from '@angular/core';
import { ProductInfo } from './components/product-info/product-info';
import { ProductReview } from './components/product-review/product-review';
import { RelatedProducts } from './components/related-products/related-products';

@Component({
  selector: 'app-product-details',
  imports: [ProductInfo, RelatedProducts, ProductReview],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {}

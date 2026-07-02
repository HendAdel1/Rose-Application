import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductApiItem } from '../../shared/products/models/product-api-item.model';
import { ProductsService } from '../../shared/products/services/products.service';

import { ProductReview } from './components/product-review/product-review';
import { RelatedProducts } from './components/related-products/related-products';
import { ProductInfo } from './components/product-info/product-info';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-product-details',
  imports: [ProductInfo, RelatedProducts, ProductReview, TranslatePipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly product = signal<ProductApiItem | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = params.get('id');
        if (id) {
          this.loadProduct(id);
        } else {
          this.loading.set(false);
        }
      });
  }

  private loadProduct(id: string): void {
    this.loading.set(true);
    this.productsService
      .getProductById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (product) => {
          this.product.set(product);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }
}

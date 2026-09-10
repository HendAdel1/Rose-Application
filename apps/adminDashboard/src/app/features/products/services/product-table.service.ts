import { Injectable, inject } from '@angular/core';
import { DataTableService } from '../../../shared/reusable-table/services/data-table.service';
import { ProductTableConfigService } from './product-table-config.service';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

/**
 * Feature-level Table Service for Products extending DataTableService.
 *
 * Can be provided instead of generic DataTableService if developers prefer
 * pre-configured encapsulation:
 * ```typescript
 * @Component({
 *   providers: [{ provide: DataTableService, useClass: ProductTableService }]
 * })
 * ```
 */
@Injectable()
export class ProductTableService extends DataTableService<Product> {
  private readonly configPreset = inject(ProductTableConfigService);
  private readonly productService = inject(ProductService);

  constructor() {
    super();
    this.setColumns(this.configPreset.getDefaultColumns());
    this.bindDataSignal(this.productService.products);
    this.bindLoadingSignal(this.productService.loading);
    this.setActions([
      { label: 'Edit', icon: 'lucidePencil', styleClass: 'edit-btn' },
      { label: 'Delete', icon: 'lucideTrash2', styleClass: 'delete-btn' },
    ]);
    this.setActionHandler((event) => {
      if (event.action === 'Delete') {
        this.productService.deleteProduct(event.row.id);
      }
    });
  }
}

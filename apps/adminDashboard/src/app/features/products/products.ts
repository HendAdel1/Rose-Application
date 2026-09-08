import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ReusableTable, TableHeader, DataTableService } from '../../shared/reusable-table';
import { ProductTableConfigService } from './services/product-table-config.service';
import { ProductService } from './services/product.service';
import { Product } from './models/product.model';

/**
 * Products Feature Component.
 *
 * Demonstrates Service-Driven table configuration:
 * 1. Component provides `DataTableService` at the component level (`providers: [DataTableService]`).
 * 2. Columns are configured from `ProductTableConfigService`.
 * 3. Reactive signals for data and loading are bound from `ProductService`.
 * 4. In HTML, developer simply places `<app-reusable-table />` with `<app-table-header />`.
 *
 * @example
 * ```html
 * <!-- In products.html: -->
 * <section class="products-section min-h-[200px]" [attr.aria-label]="'PRODUCTS.TITLE' | translate">
 *   <app-reusable-table>
 *     <app-table-header
 *       title="PRODUCTS.TITLE"
 *       actionLabel="PRODUCTS.ADD_PRODUCT"
 *       (actionClick)="onAddProduct()"
 *     />
 *   </app-reusable-table>
 * </section>
 * ```
 */
@Component({
  selector: 'app-admin-products',
  imports: [ReusableTable, TableHeader, TranslatePipe],
  providers: [DataTableService],
  templateUrl: './products.html',
  styleUrl: './products.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Products implements OnInit {
  private readonly dataTableService = inject(DataTableService<Product>);
  private readonly productService = inject(ProductService);
  private readonly tableConfigService = inject(ProductTableConfigService);

  ngOnInit(): void {
    this.configureTableColumns();
    this.configureTableActions();
    this.loadData();
  }

  /**
   * Action handler triggered when clicking "Add a new product" button.
   */
  onAddProduct(): void {
    // Hook for Add Product dialog or navigation
    console.info('Add a new product triggered');
  }

  /**
   * Configure table columns using reusable config preset
   */
  private configureTableColumns(): void {
    this.dataTableService.setColumns(this.tableConfigService.getDefaultColumns());
  }

  /**
   * Configure row actions
   */
  private configureTableActions(): void {
    this.dataTableService.setActions([
      {
        label: 'Edit',
        icon: 'lucidePencil',
        styleClass: 'edit-btn',
      },
      {
        label: 'Delete',
        icon: 'lucideTrash2',
        styleClass: 'delete-btn',
      },
    ]);

    this.dataTableService.setActionHandler((event) => {
      if (event.action === 'Delete') {
        this.productService.deleteProduct(event.row.id);
      } else if (event.action === 'Edit') {
        console.info('Editing product:', event.row);
      }
    });
  }

  /**
   * Bind product data and loading reactively using Angular Signals
   * and configures server-side pagination before triggering the initial fetch.
   */
  private loadData(): void {
    this.dataTableService.bindDataSignal(this.productService.products);
    this.dataTableService.bindLoadingSignal(this.productService.loading);
    this.dataTableService.enableServerSidePagination({
      pageSize: 20,
      totalRecordsSignal: computed(() => this.productService.metadata()?.total ?? 0),
      onPageChange: (page, limit) => {
        this.productService.loadProducts(page, limit);
      },
    });
    this.productService.loadProducts();
  }
}

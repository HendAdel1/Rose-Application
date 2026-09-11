import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ConfirmDialog } from '@org/sharedComponents';
import { ToastrService } from 'ngx-toastr';

import { DataTableService, ReusableTable, TableHeader } from '../../shared/reusable-table';
import { Product } from './models/product.model';
import { ProductService } from './services/product.service';
import { ProductTableConfigService } from './services/product-table-config.service';

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
  imports: [ReusableTable, TableHeader, TranslatePipe, ConfirmDialog],
  providers: [DataTableService],
  templateUrl: './products.html',
  styleUrl: './products.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Products implements OnInit {
  private readonly dataTableService = inject(DataTableService<Product>);
  private readonly productService = inject(ProductService);
  private readonly tableConfigService = inject(ProductTableConfigService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isDeleteOpen = signal(false);
  readonly deleting = signal(false);
  private readonly pendingDelete = signal<Product | null>(null);

  readonly deleteMessage = computed(() =>
    this.translate.instant('CONFIRM_DIALOG.DELETE_MESSAGE', {
      entity: this.translate.instant('CONFIRM_DIALOG.ENTITIES.PRODUCT'),
    }),
  );

  ngOnInit(): void {
    this.configureTableColumns();
    this.configureTableActions();
    this.loadData();
  }

  onAddProduct(): void {
    void this.router.navigate(['/adminDashboard/products/add']);
  }


  closeDeleteDialog(): void {
    if (this.deleting()) {
      return;
    }
    this.isDeleteOpen.set(false);
    this.pendingDelete.set(null);
  }

  confirmDelete(): void {
    const row = this.pendingDelete();
    if (!row || this.deleting()) {
      return;
    }

    this.deleting.set(true);
    this.productService
      .deleteProduct(row.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deleting.set(false);
          this.closeDeleteDialog();
          this.toastr.success(this.translate.instant('ADMIN_PRODUCTS.DELETE_SUCCESS'));
        },
        error: (err) => {
          this.deleting.set(false);
          this.toastr.error(
            err?.error?.message ?? this.translate.instant('ADMIN_PRODUCTS.DELETE_ERROR'),
          );
        },
      });
  }

  private configureTableColumns(): void {
    this.dataTableService.setColumns(this.tableConfigService.getDefaultColumns());
  }

  private configureTableActions(): void {
    this.dataTableService.setActions([
      {
        label: 'TABLE.ACTIONS.EDIT',
        action: 'Edit',
        icon: 'lucidePencil',
        styleClass: 'edit-btn',
      },
      {
        label: 'TABLE.ACTIONS.DELETE',
        action: 'Delete',
        icon: 'lucideTrash2',
        styleClass: 'delete-btn',
      },
    ]);

    this.dataTableService.setActionHandler((event) => {
      if (event.action === 'Delete' || event.action === 'TABLE.ACTIONS.DELETE') {
        this.pendingDelete.set(event.row);
        this.isDeleteOpen.set(true);
        return;
      }

      if (event.action === 'Edit' || event.action === 'TABLE.ACTIONS.EDIT') {
        void this.router.navigate(['/adminDashboard/products', event.row.id, 'edit']);
      }
    });
  }

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

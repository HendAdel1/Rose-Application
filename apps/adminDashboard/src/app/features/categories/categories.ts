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
import { CategoryRow } from './models/category-row.model';
import { CategoriesService } from './services/categories.service';
import { CategoryTableConfigService } from './services/category-table-config.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [ReusableTable, TableHeader, TranslatePipe, ConfirmDialog],
  providers: [DataTableService],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Categories implements OnInit {
  private readonly dataTableService = inject(DataTableService<CategoryRow>);
  private readonly categoriesService = inject(CategoriesService);
  private readonly tableConfigService = inject(CategoryTableConfigService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isDeleteOpen = signal(false);
  readonly deleting = signal(false);
  private readonly pendingDelete = signal<CategoryRow | null>(null);

  readonly deleteMessage = computed(() =>
    this.translate.instant('CONFIRM_DIALOG.DELETE_MESSAGE', {
      entity: this.translate.instant('CONFIRM_DIALOG.ENTITIES.CATEGORY'),
    }),
  );

  ngOnInit(): void {
    this.configureTableColumns();
    this.configureTableActions();
    this.loadData();
  }

  onAddCategory(): void {
    void this.router.navigate(['/adminDashboard/categories/add']);
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
    this.categoriesService
      .deleteCategory(row.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deleting.set(false);
          this.isDeleteOpen.set(false);
          this.pendingDelete.set(null);
          this.toastr.success(this.translate.instant('ADMIN_CATEGORIES.DELETE_SUCCESS'));
        },
        error: (err) => {
          this.deleting.set(false);
          this.toastr.error(
            err?.error?.message ?? this.translate.instant('ADMIN_CATEGORIES.DELETE_ERROR'),
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
        visible: (row) => !row.immutable,
      },
      {
        label: 'TABLE.ACTIONS.DELETE',
        action: 'Delete',
        icon: 'lucideTrash2',
        styleClass: 'delete-btn',
        visible: (row) => !row.immutable,
      },
    ]);

    this.dataTableService.setActionHandler((event) => {
      if (event.action === 'Delete' || event.action === 'TABLE.ACTIONS.DELETE') {
        this.openDeleteDialog(event.row);
        return;
      }

      if (event.action === 'Edit' || event.action === 'TABLE.ACTIONS.EDIT') {
        void this.router.navigate(['/adminDashboard/categories', event.row.id, 'edit']);
      }
    });
  }

  private loadData(): void {
    this.dataTableService.bindDataSignal(this.categoriesService.categories);
    this.dataTableService.bindLoadingSignal(this.categoriesService.loading);
    this.dataTableService.setEmptyMessage('TABLE.NO_RECORDS', 'ADMIN_CATEGORIES.ADD_NEW');
    this.dataTableService.enableServerSidePagination({
      pageSize: 20,
      totalRecordsSignal: computed(() => this.categoriesService.total()),
      onPageChange: (page, limit) => {
        this.categoriesService.loadCategories(page, limit);
      },
    });
    this.categoriesService.loadCategories();
  }

  private openDeleteDialog(row: CategoryRow): void {
    this.pendingDelete.set(row);
    this.isDeleteOpen.set(true);
  }
}

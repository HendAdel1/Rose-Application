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
import { OccasionRow } from './models/occasion-row.model';
import { OccasionsService } from './services/occasions.service';
import { OccasionTableConfigService } from './services/occasion-table-config.service';

@Component({
  selector: 'app-admin-occasions',
  standalone: true,
  imports: [ReusableTable, TableHeader, TranslatePipe, ConfirmDialog],
  providers: [DataTableService],
  templateUrl: './occasions.html',
  styleUrl: './occasions.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Occasions implements OnInit {
  private readonly dataTableService = inject(DataTableService<OccasionRow>);
  private readonly occasionsService = inject(OccasionsService);
  private readonly tableConfigService = inject(OccasionTableConfigService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isDeleteOpen = signal(false);
  readonly deleting = signal(false);
  private readonly pendingDelete = signal<OccasionRow | null>(null);

  readonly deleteMessage = computed(() =>
    this.translate.instant('CONFIRM_DIALOG.DELETE_MESSAGE', {
      entity: this.translate.instant('CONFIRM_DIALOG.ENTITIES.OCCASION'),
    }),
  );

  ngOnInit(): void {
    this.configureTableColumns();
    this.configureTableActions();
    this.loadData();
  }

  onAddOccasion(): void {
    void this.router.navigate(['/adminDashboard/occasions/add']);
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
    this.occasionsService
      .deleteOccasion(row.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deleting.set(false);
          this.isDeleteOpen.set(false);
          this.pendingDelete.set(null);
          this.toastr.success(this.translate.instant('ADMIN_OCCASIONS.DELETE_SUCCESS'));
        },
        error: (err) => {
          this.deleting.set(false);
          this.toastr.error(
            err?.error?.message ?? this.translate.instant('ADMIN_OCCASIONS.DELETE_ERROR'),
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
        void this.router.navigate(['/adminDashboard/occasions', event.row.id, 'edit']);
      }
    });
  }

  private loadData(): void {
    this.dataTableService.bindDataSignal(this.occasionsService.occasions);
    this.dataTableService.bindLoadingSignal(this.occasionsService.loading);
    this.dataTableService.setEmptyMessage('TABLE.NO_RECORDS', 'ADMIN_OCCASIONS.ADD_NEW');
    this.dataTableService.enableServerSidePagination({
      pageSize: 20,
      totalRecordsSignal: computed(() => this.occasionsService.total()),
      onPageChange: (page, limit) => {
        this.occasionsService.loadOccasions(page, limit);
      },
    });
    this.occasionsService.loadOccasions();
  }

  private openDeleteDialog(row: OccasionRow): void {
    this.pendingDelete.set(row);
    this.isDeleteOpen.set(true);
  }
}

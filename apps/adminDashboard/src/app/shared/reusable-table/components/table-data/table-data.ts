import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NgStyle } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Popover } from 'primeng/popover';
import { TranslatePipe } from '@ngx-translate/core';
import {
  LucideArrowDown,
  LucideArrowUp,
  LucideArrowUpDown,
  LucideLoader2,
  LucideMoreVertical,
  LucidePackage,
  LucidePencil,
  LucideRotateCcw,
  LucideTrash2,
} from '@lucide/angular';
import { Column } from '../../models/table-column.model';
import { TableAction, TableActionEvent } from '../../models/table-action.model';
import { DataTableService } from '../../services/data-table.service';

export interface ActiveRowContext<T> {
  row: T;
  rowIndex: number;
}

/**
 * Table Data Component.
 *
 * Supports:
 * - 3-state sorting cycle (Ascending -> Descending -> Reset to Default)
 * - Service-driven configuration via `DataTableService`
 * - Reactive Signals architecture with `OnPush` performance
 */
@Component({
  selector: 'app-table-data',
  imports: [
    TableModule,
    Popover,
    NgStyle,
    TranslatePipe,
    LucidePackage,
    LucidePencil,
    LucideRotateCcw,
    LucideTrash2,
    LucideArrowUpDown,
    LucideArrowUp,
    LucideArrowDown,
    LucideLoader2,
    LucideMoreVertical,
  ],
  templateUrl: './table-data.html',
  styleUrl: './table-data.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableData<T extends Record<string, unknown> = Record<string, unknown>> {
  private static readonly EMPTY_STYLE: Record<string, string> = Object.freeze({});

  /** Optional injected DataTableService provided at component/module level */
  private readonly dataTableService = inject<DataTableService<T>>(DataTableService, { optional: true });

  /** Optional direct column definitions input */
  columns = input<Column<T>[]>();

  /** Optional direct row data input */
  data = input<T[]>();

  /** Optional direct loading state input */
  loading = input<boolean>();

  /** Optional direct action buttons input */
  actions = input<TableAction<T>[]>();

  /** Optional row-level styling function input */
  rowStyleFn = input<((row: T) => Record<string, string>) | undefined>(undefined);

  /** Property key used for row trackBy tracking (defaults to 'id') */
  trackByKey = input<string>();

  /** Optional custom title for empty state */
  emptyMessage = input<string>();

  /** Optional custom subtitle/description for empty state */
  emptySubMessage = input<string>();

  /** Optional custom table style input */
  tableStyle = input<Record<string, string>>();

  /** Computes effective table style — always enforces fixed layout so columns respect declared widths */
  readonly effectiveTableStyle = computed<Record<string, string>>(() => {
    return { 'table-layout': 'fixed', ...(this.tableStyle() ?? {}) };
  });

  /** Emitted when any action button is clicked */
  actionClicked = output<TableActionEvent<T>>();

  /** Tracks the currently sorted column field */
  readonly currentSortField = signal<string | null>(null);

  /** Tracks the current sort order (1: asc, -1: desc, 0: default/none) */
  readonly currentSortOrder = signal<number>(0);

  /** Resolves columns from direct input or injected DataTableService */
  readonly effectiveColumns = computed<Column<T>[]>(() => {
    const direct = this.columns();
    if (direct !== undefined) {
      return direct;
    }
    return this.dataTableService?.columns() ?? [];
  });

  /** Resolves row data from direct input or injected DataTableService with search filtering applied */
  readonly effectiveData = computed<T[]>(() => {
    const direct = this.data();
    if (direct !== undefined) {
      const term = this.dataTableService?.searchTerm()?.trim().toLowerCase();
      if (!term) {
        return direct;
      }
      const cols = this.effectiveColumns();
      return direct.filter((row) => {
        if (cols.length > 0) {
          return cols.some((col) => {
            if (col.type === 'actions' || col.searchable === false) {
              return false;
            }
            const key = (col.field || col.key) as keyof T | undefined;
            if (key && row[key] != null) {
              if (String(row[key]).toLowerCase().includes(term)) {
                return true;
              }
            }
            return false;
          });
        }
        return Object.values(row).some(
          (val) => val != null && typeof val !== 'object' && String(val).toLowerCase().includes(term),
        );
      });
    }
    return this.dataTableService?.filteredData() ?? [];
  });

  /** Resolves loading state from direct input or injected DataTableService */
  readonly effectiveLoading = computed<boolean>(() => {
    const direct = this.loading();
    if (direct !== undefined) {
      return direct;
    }
    return this.dataTableService?.loading() ?? false;
  });

  /**
   * Computed data array supporting 3-state sorting:
   * 1st click: Ascending (1)
   * 2nd click: Descending (-1)
   * 3rd click: Reset to Default Unsorted (0)
   */
  readonly displayData = computed<T[]>(() => {
    const data = this.effectiveData();
    const field = this.currentSortField();
    const order = this.currentSortOrder();

    if (!field || order === 0 || !data || data.length === 0) {
      return data;
    }

    return [...data].sort((a, b) => {
      const valA = a[field];
      const valB = b[field];

      if (valA == null && valB != null) return -1 * order;
      if (valA != null && valB == null) return 1 * order;
      if (valA == null && valB == null) return 0;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return (valA - valB) * order;
      }

      const strA = String(valA);
      const strB = String(valB);
      return strA.localeCompare(strB, undefined, { numeric: true, sensitivity: 'base' }) * order;
    });
  });

  /**
   * Computed display data accounting for client-side pagination:
   * Slices displayData for current page when client-side pagination is active in DataTableService.
   */
  readonly pagedDisplayData = computed<T[]>(() => {
    const sorted = this.displayData();
    if (this.dataTableService && !this.dataTableService.isServerSide() && this.data() === undefined) {
      const page = this.dataTableService.page();
      const size = this.dataTableService.pageSize();
      const start = (page - 1) * size;
      return sorted.slice(start, start + size);
    }
    return sorted;
  });

  /** Resolves actions from direct input or injected DataTableService */
  readonly effectiveActions = computed<TableAction<T>[]>(() => {
    const direct = this.actions();
    if (direct !== undefined) {
      return direct;
    }
    return this.dataTableService?.actions() ?? [];
  });

  /** Resolves row styling function from direct input or injected DataTableService */
  readonly effectiveRowStyleFn = computed<((row: T) => Record<string, string>) | undefined>(() => {
    const direct = this.rowStyleFn();
    if (direct !== undefined) {
      return direct;
    }
    return this.dataTableService?.rowStyleFn();
  });

  /** Resolves trackByKey from direct input or injected DataTableService */
  readonly effectiveTrackByKey = computed<string>(() => {
    return this.trackByKey() ?? this.dataTableService?.trackByKey() ?? 'id';
  });

  /** Resolves empty state title */
  readonly effectiveEmptyMessage = computed<string>(() => {
    return this.emptyMessage() ?? this.dataTableService?.emptyMessage() ?? 'No records found';
  });

  /** Resolves empty state description */
  readonly effectiveEmptySubMessage = computed<string>(() => {
    return (
      this.emptySubMessage() ??
      this.dataTableService?.emptySubMessage() ??
      'There are no items to display right now.'
    );
  });

  /**
   * Handles column header click to cycle sorting state:
   * 1st click: Ascending (1)
   * 2nd click: Descending (-1)
   * 3rd click: Reset to Default Unsorted (0)
   *
   * @param field - The field key being sorted.
   */
  onSortClick(field?: string): void {
    if (!field) {
      return;
    }

    if (this.currentSortField() !== field) {
      // 1st click: Ascending
      this.currentSortField.set(field);
      this.currentSortOrder.set(1);
    } else if (this.currentSortOrder() === 1) {
      // 2nd click: Descending
      this.currentSortOrder.set(-1);
    } else {
      // 3rd click: Reset to Default / Unsorted
      this.currentSortField.set(null);
      this.currentSortOrder.set(0);
    }
  }

  private formatValue(val: unknown): string {
    return typeof val === 'number' ? val.toLocaleString('en-US') : String(val ?? '');
  }

  private getColumnKey(col: Column<T>): string {
    return col.field ?? col.key ?? '';
  }

  resolveCellValue(row: T, col: Column<T>): string {
    const key = this.getColumnKey(col);
    if (col.formatter) {
      return col.formatter(row[key], row);
    }
    switch (col.type) {
      case 'formatted': {
        const value = this.formatValue(row[key]);
        const prefix = col.prefix ?? '';
        const suffix = col.suffix ?? '';
        return `${prefix}${value} ${suffix}`.trim();
      }
      case 'composite': {
        if (!col.compositeKeys?.length || !col.compositeTemplate) {
          return this.formatValue(row[key]);
        }
        let result = col.compositeTemplate;
        col.compositeKeys.forEach((k, index) => {
          result = result.replace(`{${index}}`, this.formatValue(row[k]));
        });
        return result;
      }
      default:
        return this.formatValue(row[key]);
    }
  }

  resolveCellStyle(row: T, col: Column<T>): Record<string, string> {
    if (!col.cellStyleFn) {
      return TableData.EMPTY_STYLE;
    }
    const key = this.getColumnKey(col);
    return col.cellStyleFn(row[key], row);
  }

  resolveRowStyle(row: T): Record<string, string> {
    const fn = this.effectiveRowStyleFn();
    if (!fn) {
      return TableData.EMPTY_STYLE;
    }
    return fn(row);
  }

  /** Tracks active row context for mobile actions menu */
  readonly activeRowContext = signal<ActiveRowContext<T> | null>(null);

  openMobileMenu(row: T, rowIndex: number, event: MouseEvent, popover: Popover): void {
    event.stopPropagation();
    const current = this.activeRowContext();
    if (current?.rowIndex === rowIndex) {
      popover.hide();
      this.activeRowContext.set(null);
      return;
    }
    this.activeRowContext.set({ row, rowIndex });
    const triggerBtn = (event.currentTarget as HTMLElement) || (event.target as HTMLElement);
    popover.toggle(event, triggerBtn);
  }

  closeMobileMenu(popover?: Popover): void {
    popover?.hide();
    this.activeRowContext.set(null);
  }

  /**
   * Resolves the translation key for an action button label.
   * Shorthand labels ('Edit', 'Delete', 'Restore') are mapped to standard keys
   * if full keys are not supplied.
   */
  resolveActionLabel(action: TableAction<T>): string {
    if (!action?.label) {
      return '';
    }
    if (action.label === 'Edit') {
      return 'TABLE.ACTIONS.EDIT';
    }
    if (action.label === 'Delete') {
      return 'TABLE.ACTIONS.DELETE';
    }
    if (action.label === 'Restore') {
      return 'TABLE.ACTIONS.RESTORE';
    }
    return action.label;
  }

  isEditAction(action: TableAction<T>): boolean {
    return (
      action.label === 'Edit' ||
      action.label === 'TABLE.ACTIONS.EDIT' ||
      action.action === 'Edit' ||
      action.icon === 'lucidePencil' ||
      action.styleClass?.includes('edit-btn') === true
    );
  }

  isDeleteAction(action: TableAction<T>): boolean {
    return (
      action.label === 'Delete' ||
      action.label === 'TABLE.ACTIONS.DELETE' ||
      action.action === 'Delete' ||
      action.icon === 'lucideTrash2' ||
      action.styleClass?.includes('delete-btn') === true
    );
  }

  isRestoreAction(action: TableAction<T>): boolean {
    return (
      action.label === 'Restore' ||
      action.label === 'TABLE.ACTIONS.RESTORE' ||
      action.action === 'Restore' ||
      action.icon === 'lucideRotateCcw' ||
      action.styleClass?.includes('restore-btn') === true
    );
  }

  onMobileActionClick(action: TableAction<T>, row: T, rowIndex: number, popover: Popover): void {
    popover.hide();
    this.activeRowContext.set(null);
    this.onActionClick(action, row, rowIndex);
  }

  onActionClick(action: TableAction<T>, row: T, rowIndex: number): void {
    const actionKey =
      action.action ??
      (action.label === 'TABLE.ACTIONS.EDIT'
        ? 'Edit'
        : action.label === 'TABLE.ACTIONS.DELETE'
        ? 'Delete'
        : action.label === 'TABLE.ACTIONS.RESTORE'
        ? 'Restore'
        : action.label);
    const event: TableActionEvent<T> = { action: actionKey, row, rowIndex };
    this.actionClicked.emit(event);
    this.dataTableService?.handleAction(event);
  }
}

import { Injectable, Signal, computed, signal } from '@angular/core';
import { Column } from '../models/table-column.model';
import { TableAction, TableActionEvent } from '../models/table-action.model';
import { ServerSidePaginationConfig } from '../models/table-pagination.model';

/**
 * Service managing table state and configuration.
 *
 * Developers provide this service in their feature component to control columns,
 * data, actions, empty state messaging, and event handlers in TypeScript.
 *
 * @example
 * ```typescript
 * @Component({
 *   selector: 'app-holidays',
 *   imports: [ReusableTable],
 *   providers: [DataTableService],
 *   template: `<app-reusable-table />`,
 * })
 * export class HolidaysComponent implements OnInit {
 *   private readonly dataTableService = inject(DataTableService<Holiday>);
 *
 *   ngOnInit(): void {
 *     this.configureTableColumns();
 *     this.dataTableService.setEmptyMessage('No holidays found', 'Add your first holiday to get started.');
 *   }
 * }
 * ```
 */
@Injectable()
export class DataTableService<T extends Record<string, unknown> = Record<string, unknown>> {
  private readonly _columns = signal<Column<T>[]>([]);
  private readonly _data = signal<T[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _actions = signal<TableAction<T>[]>([]);
  private readonly _rowStyleFn = signal<((row: T) => Record<string, string>) | undefined>(undefined);
  private readonly _trackByKey = signal<string>('id');
  private readonly _emptyMessage = signal<string>('No records found');
  private readonly _emptySubMessage = signal<string>('There are no items to display right now.');
  private readonly _searchTerm = signal<string>('');
  private readonly _searchFilterFn = signal<((row: T, term: string) => boolean) | undefined>(undefined);
  private readonly _page = signal<number>(1);
  private readonly _pageSize = signal<number>(10);
  private readonly _totalRecords = signal<number | null>(null);
  private readonly _isServerSide = signal<boolean>(false);
  private _externalTotalRecordsSignal?: Signal<number>;
  private _externalPageSignal?: Signal<number>;
  private _pageChangeHandler?: (page: number, pageSize: number) => void;
  private _externalDataSignal?: Signal<T[]>;
  private _externalLoadingSignal?: Signal<boolean>;
  private _actionHandler?: (event: TableActionEvent<T>) => void;

  /** Current columns configuration signal */
  readonly columns = this._columns.asReadonly();

  /** Current search term signal */
  readonly searchTerm = this._searchTerm.asReadonly();

  /** Current table data signal (either static or bound from an external reactive signal) */
  readonly data = computed<T[]>(() => {
    if (this._externalDataSignal) {
      return this._externalDataSignal();
    }
    return this._data();
  });

  /** Filtered table data computed reactively based on current searchTerm and columns */
  readonly filteredData = computed<T[]>(() => {
    const rawData = this.data();
    const query = this._searchTerm().trim().toLowerCase();

    if (!query) {
      return rawData;
    }

    const customFilter = this._searchFilterFn();
    if (customFilter) {
      return rawData.filter((row) => customFilter(row, query));
    }

    const cols = this._columns();

    return rawData.filter((row) => {
      if (cols.length > 0) {
        return cols.some((col) => {
          if (col.type === 'actions' || col.searchable === false) {
            return false;
          }

          const key = (col.field || col.key) as keyof T | undefined;
          if (key && row[key] != null) {
            const rawVal = String(row[key]).toLowerCase();
            if (rawVal.includes(query)) {
              return true;
            }
          }

          if (col.formatter && key) {
            try {
              const formatted = col.formatter(row[key], row);
              if (formatted && formatted.toLowerCase().includes(query)) {
                return true;
              }
            } catch {
              // Ignore formatter errors during search evaluation
            }
          }

          if (col.type === 'composite' && col.compositeKeys) {
            return col.compositeKeys.some((k) => {
              const val = row[k as keyof T];
              return val != null && String(val).toLowerCase().includes(query);
            });
          }

          return false;
        });
      }

      return Object.values(row).some((val) => {
        if (val == null || typeof val === 'object') {
          return false;
        }
        return String(val).toLowerCase().includes(query);
      });
    });
  });

  /** Current loading state signal */
  readonly loading = computed<boolean>(() => {
    if (this._externalLoadingSignal) {
      return this._externalLoadingSignal();
    }
    return this._loading();
  });

  /** Current row actions configuration signal */
  readonly actions = this._actions.asReadonly();

  /** Row-level conditional styling function signal */
  readonly rowStyleFn = this._rowStyleFn.asReadonly();

  /** Property key used by trackBy signal */
  readonly trackByKey = this._trackByKey.asReadonly();

  /** Custom message for table empty state */
  readonly emptyMessage = this._emptyMessage.asReadonly();

  /** Custom subtitle/description for table empty state */
  readonly emptySubMessage = this._emptySubMessage.asReadonly();

  /** 1-based active page index signal */
  readonly page = computed<number>(() => {
    if (this._externalPageSignal) {
      return this._externalPageSignal();
    }
    return this._page();
  });

  /** Number of records to display per page signal */
  readonly pageSize = this._pageSize.asReadonly();

  /** Indicates whether pagination is handled server-side */
  readonly isServerSide = this._isServerSide.asReadonly();

  /** Total records count signal (either external signal, static total, or filteredData count) */
  readonly totalRecords = computed<number>(() => {
    if (this._externalTotalRecordsSignal) {
      return this._externalTotalRecordsSignal();
    }
    if (this._totalRecords() !== null) {
      return this._totalRecords()!;
    }
    return this.filteredData().length;
  });

  /** Total pages calculated reactively */
  readonly totalPages = computed<number>(() => {
    const size = this._pageSize();
    if (size <= 0) {
      return 1;
    }
    return Math.ceil(this.totalRecords() / size) || 1;
  });

  /** First record index (0-based) for paginator bindings */
  readonly first = computed<number>(() => (this.page() - 1) * this.pageSize());

  /**
   * Sets the columns array for the table.
   *
   * @param columns - Array of Column definitions.
   */
  setColumns(columns: Column<T>[]): void {
    this._columns.set(columns);
  }

  /**
   * Sets static row data for the table.
   *
   * @param data - Array of row objects.
   */
  setData(data: T[]): void {
    this._externalDataSignal = undefined;
    this._data.set(data);
  }

  /**
   * Binds an Angular Signal directly as the data source for reactive updates.
   *
   * @param dataSignal - Readonly signal providing table data.
   */
  bindDataSignal(dataSignal: Signal<T[]>): void {
    this._externalDataSignal = dataSignal;
  }

  /**
   * Sets static loading state.
   *
   * @param loading - Boolean loading indicator.
   */
  setLoading(loading: boolean): void {
    this._externalLoadingSignal = undefined;
    this._loading.set(loading);
  }

  /**
   * Binds an Angular Signal directly as the loading source for reactive updates.
   *
   * @param loadingSignal - Readonly signal providing table loading state.
   */
  bindLoadingSignal(loadingSignal: Signal<boolean>): void {
    this._externalLoadingSignal = loadingSignal;
  }

  /**
   * Sets the row action buttons.
   *
   * @param actions - Array of action button definitions.
   */
  setActions(actions: TableAction<T>[]): void {
    this._actions.set(actions);
  }

  /**
   * Configures empty state display text.
   *
   * @param message - Main empty state title (e.g. 'No products found').
   * @param subMessage - Optional subtitle/hint.
   */
  setEmptyMessage(message: string, subMessage = 'There are no items to display right now.'): void {
    this._emptyMessage.set(message);
    this._emptySubMessage.set(subMessage);
  }

  /**
   * Sets a row styling function for conditional row styles.
   *
   * @param fn - Predicate function returning CSS inline style object.
   */
  setRowStyle(fn: (row: T) => Record<string, string>): void {
    this._rowStyleFn.set(fn);
  }

  /**
   * Sets the trackBy key for DOM reconciliation.
   *
   * @param key - Property key from the row entity (defaults to 'id').
   */
  setTrackByKey(key: string): void {
    this._trackByKey.set(key);
  }

  /**
   * Registers a callback for handling row action button clicks.
   *
   * @param handler - Callback receiving the action event.
   */
  setActionHandler(handler: (event: TableActionEvent<T>) => void): void {
    this._actionHandler = handler;
  }

  /**
   * Updates the active client-side search query string and resets active page to 1.
   *
   * @param term - The search query term.
   */
  setSearchTerm(term: string): void {
    this._searchTerm.set(term);
    this._page.set(1);
  }

  /**
   * Clears the active search query string and resets active page to 1.
   */
  clearSearch(): void {
    this._searchTerm.set('');
    this._page.set(1);
  }

  /**
   * Sets a custom search filter predicate function for entity-specific search logic.
   *
   * @param fn - Predicate function returning true if row matches search query.
   */
  setSearchFilter(fn: ((row: T, term: string) => boolean) | undefined): void {
    this._searchFilterFn.set(fn);
  }

  /**
   * Internal dispatcher called by ReusableTable when an action is triggered.
   */
  handleAction(event: TableActionEvent<T>): void {
    this._actionHandler?.(event);
  }

  /**
   * Sets the current 1-based page number and triggers registered pageChange callbacks.
   *
   * @param page - 1-based page index.
   */
  setPage(page: number): void {
    if (page < 1) {
      page = 1;
    }
    this._page.set(page);
    this._pageChangeHandler?.(page, this._pageSize());
  }

  /**
   * Sets the page size (number of rows displayed per page).
   *
   * @param size - Positive number of items per page.
   */
  setPageSize(size: number): void {
    if (size > 0) {
      this._pageSize.set(size);
      this._page.set(1);
      this._pageChangeHandler?.(1, size);
    }
  }

  /**
   * Overrides the total records count manually.
   *
   * @param total - Total records count or null to revert to automatic counting.
   */
  setTotalRecords(total: number | null): void {
    this._totalRecords.set(total);
  }

  /**
   * Registers a callback for page navigation events.
   *
   * @param handler - Callback receiving (page, pageSize).
   */
  setPageChangeHandler(handler: (page: number, pageSize: number) => void): void {
    this._pageChangeHandler = handler;
  }

  /**
   * Configures server-side pagination with reactive signals and fetch triggers.
   *
   * @param config - ServerSidePaginationConfig options.
   */
  enableServerSidePagination(config: ServerSidePaginationConfig): void {
    this._isServerSide.set(true);
    if (config.pageSize) {
      this._pageSize.set(config.pageSize);
    }
    if (config.initialPage) {
      this._page.set(config.initialPage);
    }
    this._externalTotalRecordsSignal = config.totalRecordsSignal;
    this._pageChangeHandler = config.onPageChange;
  }
}

import { TableColumn } from '../models/table-column.model';
import { TableAction } from '../models/table-action.model';
import { TableConfig } from '../models/table-config.model';

/**
 * Fluent builder for creating strictly typed, high-performance table configurations in TypeScript.
 *
 * Designed for clean code and maximum reusability across all feature modules.
 *
 * @template T - The entity data model of the table row.
 *
 * @example
 * ```typescript
 * // In your feature config service:
 * export class ProductTableConfigService {
 *   readonly config = new TableConfigBuilder<Product>()
 *     .addTextColumn('name', 'Name', {
 *       cellStyleFn: () => ({ 'font-weight': '600', color: '#18181b' }),
 *     })
 *     .addFormattedColumn('price', 'Price', { suffix: 'EGP' })
 *     .addTextColumn('stock', 'Stock', {
 *       cellStyleFn: (val) => Number(val) <= 4 ? { color: '#cd2e33', 'font-weight': '600' } : {},
 *     })
 *     .addTextColumn('sales', 'Sales')
 *     .addCompositeColumn(
 *       'rating',
 *       'Ratings',
 *       ['rating', 'maxRating', 'reviewCount'],
 *       '<span class="font-semibold text-zinc-900">{0}/{1}</span> <span class="text-zinc-500">({2})</span>'
 *     )
 *     .addActionsColumn()
 *     .addAction({ label: 'Edit', icon: 'lucidePencil', styleClass: 'edit-btn' })
 *     .addAction({ label: 'Delete', icon: 'lucideTrash2', styleClass: 'delete-btn' })
 *     .setTrackByKey('id')
 *     .build();
 * }
 * ```
 */
export class TableConfigBuilder<T = Record<string, unknown>> {
  private readonly columns: TableColumn<T>[] = [];
  private readonly actions: TableAction<T>[] = [];
  private trackByKey: Extract<keyof T, string> | string = 'id';
  private rowStyleFn?: (row: T) => Record<string, string>;

  /**
   * Adds a custom column definition directly.
   */
  addColumn(column: TableColumn<T>): this {
    this.columns.push(Object.freeze({ ...column }));
    return this;
  }

  /**
   * Adds a plain text column.
   *
   * @param key - Property key from the row model.
   * @param label - Header title.
   * @param options - Optional styling and formatting options.
   */
  addTextColumn(
    key: Extract<keyof T, string> | string,
    label: string,
    options?: {
      cellStyleFn?: (value: unknown, row: T) => Record<string, string>;
      formatter?: (value: unknown, row: T) => string;
      width?: string;
    }
  ): this {
    return this.addColumn({
      key,
      label,
      type: 'text',
      cellStyleFn: options?.cellStyleFn,
      formatter: options?.formatter,
      width: options?.width,
    });
  }

  /**
   * Adds a formatted column (e.g. price with currency suffix, counts with unit suffix).
   *
   * @param key - Property key from the row model.
   * @param label - Header title.
   * @param options - Suffix/prefix and styling options.
   */
  addFormattedColumn(
    key: Extract<keyof T, string> | string,
    label: string,
    options?: {
      prefix?: string;
      suffix?: string;
      cellStyleFn?: (value: unknown, row: T) => Record<string, string>;
      formatter?: (value: unknown, row: T) => string;
      width?: string;
    }
  ): this {
    return this.addColumn({
      key,
      label,
      type: 'formatted',
      prefix: options?.prefix,
      suffix: options?.suffix,
      cellStyleFn: options?.cellStyleFn,
      formatter: options?.formatter,
      width: options?.width,
    });
  }

  /**
   * Adds a composite column that aggregates multiple fields into a single cell using template placeholders.
   *
   * @param key - Identifier for the column.
   * @param label - Header title.
   * @param compositeKeys - Array of field keys to insert into `{0}`, `{1}`, etc.
   * @param compositeTemplate - HTML or text template string containing placeholders.
   * @param options - Optional styling and width options.
   */
  addCompositeColumn(
    key: Extract<keyof T, string> | string,
    label: string,
    compositeKeys: (Extract<keyof T, string> | string)[],
    compositeTemplate: string,
    options?: {
      cellStyleFn?: (value: unknown, row: T) => Record<string, string>;
      width?: string;
    }
  ): this {
    return this.addColumn({
      key,
      label,
      type: 'composite',
      compositeKeys,
      compositeTemplate,
      cellStyleFn: options?.cellStyleFn,
      width: options?.width,
    });
  }

  /**
   * Adds an action column placeholder for action buttons.
   *
   * @param label - Header title (default: empty string '').
   * @param options - Optional column width.
   */
  addActionsColumn(label = '', options?: { width?: string }): this {
    return this.addColumn({
      key: 'actions',
      label,
      type: 'actions',
      width: options?.width,
    });
  }

  /**
   * Registers an action button configuration.
   *
   * @param action - Action details including label, icon, styleClass, and visibility predicates.
   */
  addAction(action: TableAction<T>): this {
    this.actions.push(Object.freeze({ ...action }));
    return this;
  }

  /**
   * Configures row-level conditional styling.
   *
   * @param fn - Predicate function returning an inline CSS style object.
   */
  setRowStyleFn(fn: (row: T) => Record<string, string>): this {
    this.rowStyleFn = fn;
    return this;
  }

  /**
   * Sets the property key used to track rows in trackBy loops.
   *
   * @param key - Property key from the row model (default: 'id').
   */
  setTrackByKey(key: Extract<keyof T, string> | string): this {
    this.trackByKey = key;
    return this;
  }

  /**
   * Builds and returns an immutable TableConfig object.
   */
  build(): TableConfig<T> {
    return Object.freeze({
      columns: Object.freeze([...this.columns]) as TableColumn<T>[],
      actions: Object.freeze([...this.actions]) as TableAction<T>[],
      trackByKey: this.trackByKey,
      rowStyleFn: this.rowStyleFn,
    });
  }
}

/**
 * Functional factory helper for configuring a table using TableConfigBuilder.
 *
 * @example
 * ```typescript
 * export const PRODUCT_TABLE_CONFIG = createTableConfig<Product>((builder) => {
 *   builder
 *     .addTextColumn('name', 'Name')
 *     .addFormattedColumn('price', 'Price', { suffix: 'EGP' });
 * });
 * ```
 */
export function createTableConfig<T = Record<string, unknown>>(
  builderFn: (builder: TableConfigBuilder<T>) => void
): TableConfig<T> {
  const builder = new TableConfigBuilder<T>();
  builderFn(builder);
  return builder.build();
}

import { TableColumn } from './table-column.model';
import { TableAction } from './table-action.model';

/**
 * Complete table configuration specification.
 *
 * @template T - The row data type.
 *
 * @example
 * ```typescript
 * const config: TableConfig<Product> = {
 *   columns: [...],
 *   actions: [...],
 *   trackByKey: 'id',
 *   rowStyleFn: (row) => row.stock === 0 ? { opacity: '0.6' } : {},
 * };
 * ```
 */
export interface TableConfig<T = Record<string, unknown>> {
  /** Array of column configurations */
  columns: TableColumn<T>[];

  /** Optional array of row actions */
  actions?: TableAction<T>[];

  /** Property key used by trackBy (defaults to 'id') */
  trackByKey?: Extract<keyof T, string> | string;

  /** Optional dynamic row styling function */
  rowStyleFn?: (row: T) => Record<string, string>;
}

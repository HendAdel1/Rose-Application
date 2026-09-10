/**
 * Supported rendering strategies for table columns:
 * - 'text': Direct text display with optional conditional styling.
 * - 'formatted': Formats number/currency with prefix and/or suffix.
 * - 'composite': Combines multiple data fields into one cell using template placeholders ({0}, {1}).
 * - 'pipe': Applies an Angular pipe (e.g. capitalize, localizedDate, currency).
 * - 'action-badge': Displays value as a badge/pill element.
 * - 'template': Custom template slot.
 * - 'actions': Renders action buttons configured in the table.
 */
export type ColumnType =
  | 'text'
  | 'formatted'
  | 'composite'
  | 'pipe'
  | 'action-badge'
  | 'template'
  | 'actions';

/**
 * Pipe transformation configuration.
 */
export interface ColumnPipeConfig {
  name: string;
  args?: Record<string, unknown> | string;
}

/**
 * Definition of a single table column.
 * Supports both `field`/`header` and `key`/`label` naming conventions for maximum developer flexibility.
 *
 * @template T - The row data type.
 *
 * @example
 * ```typescript
 * const columns: Column<Product>[] = [
 *   {
 *     field: 'name',
 *     header: 'Product Name',
 *     type: 'text',
 *     sort: true,
 *     cellStyleFn: () => ({ 'font-weight': '600', color: '#18181b' }),
 *   },
 *   {
 *     field: 'price',
 *     header: 'Price',
 *     type: 'formatted',
 *     suffix: 'EGP',
 *     sort: true,
 *   },
 *   {
 *     field: 'rating',
 *     header: 'Ratings',
 *     type: 'composite',
 *     compositeKeys: ['rating', 'maxRating', 'reviewCount'],
 *     compositeTemplate: '<span class="font-semibold">{0}/{1}</span> ({2})',
 *     sort: false,
 *   },
 *   {
 *     field: 'actions',
 *     header: 'Actions',
 *     type: 'actions',
 *     sort: false,
 *   },
 * ];
 * ```
 */
export interface TableColumn<T = Record<string, unknown>> {
  /** The property key of the row data (or unique identifier). Alias for `key`. */
  field?: Extract<keyof T, string> | string;
  /** Property key of the row data. Alias for `field`. */
  key?: Extract<keyof T, string> | string;

  /** Display header text or translation key (e.g. 'HOLIDAYS.HOLIDAY_NAME'). Alias for `label`. */
  header?: string;
  /** Display header text or translation key. Alias for `header`. */
  label?: string;

  /** Rendering strategy for the cell */
  type: ColumnType;

  /** Whether the column can be sorted */
  sort?: boolean;

  /** Whether the column is included in client-side search filtering (defaults to true for non-actions) */
  searchable?: boolean;

  /** Angular pipe configuration (for 'pipe' column type) */
  pipe?: ColumnPipeConfig;

  /** Optional text or symbol prepended to the value (for 'formatted' type) */
  prefix?: string;

  /** Optional text or symbol appended to the value (e.g., 'EGP', 'items', '%') */
  suffix?: string;

  /** Row property keys to extract values from (for 'composite' type) */
  compositeKeys?: (Extract<keyof T, string> | string)[];

  /** HTML/text template using positional placeholders like '{0}/{1} ({2})' */
  compositeTemplate?: string;

  /** Optional function for custom value formatting */
  formatter?: (value: unknown, row: T) => string;

  /** Dynamic conditional inline styling for the cell based on its value or row data */
  cellStyleFn?: (value: unknown, row: T) => Record<string, string>;

  /** Optional CSS column width (e.g. '120px', '20%') */
  width?: string;
}

/**
 * Standard alias for `TableColumn`.
 */
export type Column<T = Record<string, unknown>> = TableColumn<T>;

import { InjectionToken, Provider, Signal, Type } from '@angular/core';
import { TableColumn } from './table-column.model';
import { TableAction, TableActionEvent } from './table-action.model';

/**
 * Helper union allowing a value to be either an Angular Signal or a static value.
 */
export type SignalOrValue<V> = Signal<V> | V;

/**
 * Contract defining the state and configuration of a ReusableTable.
 *
 * Designed to decouple configuration and state from HTML markup,
 * allowing developers to write `<app-reusable-table />` with zero input bindings.
 *
 * @template T - The row entity type.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class ProductTableService implements TableState<Product> {
 *   private readonly productService = inject(ProductService);
 *
 *   readonly columns: TableColumn<Product>[] = [...];
 *   readonly actions: TableAction<Product>[] = [...];
 *   readonly data = this.productService.products; // Signal<Product[]>
 *   readonly trackByKey = 'id';
 *
 *   onAction(event: TableActionEvent<Product>): void {
 *     console.log('Action:', event.action, event.row);
 *   }
 * }
 * ```
 */
export interface TableState<T extends Record<string, unknown> = Record<string, unknown>> {
  /** Columns definition (Signal or static array) */
  columns: SignalOrValue<TableColumn<T>[]>;

  /** Table row data (Signal or static array) */
  data: SignalOrValue<T[]>;

  /** Optional action buttons (Signal or static array) */
  actions?: SignalOrValue<TableAction<T>[]>;

  /** Optional row-level styling function */
  rowStyleFn?: (row: T) => Record<string, string>;

  /** Property key used for row trackBy tracking (defaults to 'id') */
  trackByKey?: Extract<keyof T, string> | string;

  /** Action handler invoked when an action button is clicked */
  onAction?: (event: TableActionEvent<T>) => void;
}

/**
 * Injection token used to provide TableState to ReusableTable instances.
 */
export const TABLE_STATE = new InjectionToken<TableState>('TABLE_STATE');

/**
 * Provider helper function for clean, type-safe registration of TableState in components.
 *
 * @example
 * ```typescript
 * @Component({
 *   selector: 'app-products',
 *   imports: [ReusableTable],
 *   providers: [provideTableState(ProductTableService)],
 *   template: `<app-reusable-table />`
 * })
 * export class ProductsComponent {}
 * ```
 */
export function provideTableState<T extends Record<string, unknown>>(
  serviceType: Type<TableState<T>>
): Provider[] {
  return [
    serviceType,
    {
      provide: TABLE_STATE,
      useExisting: serviceType,
    },
  ];
}

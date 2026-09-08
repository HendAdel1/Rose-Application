import { Injectable } from '@angular/core';
import { TableConfigBuilder } from './table-config.builder';
import { TableConfig } from '../models/table-config.model';

/**
 * Service to create and manage table configurations across the application.
 *
 * Developers can inject this service to fluently build type-safe configurations
 * with autocomplete for column types, formatters, and Lucide icons.
 *
 * @example
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class OrderTableConfigService {
 *   private readonly tableConfigService = inject(TableConfigService);
 *
 *   readonly config = this.tableConfigService
 *     .createBuilder<Order>()
 *     .addTextColumn('orderNumber', 'Order #')
 *     .addFormattedColumn('total', 'Total', { suffix: 'EGP' })
 *     .addActionsColumn()
 *     .addAction({ label: 'View', icon: 'lucideEye' })
 *     .build();
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class TableConfigService {
  /**
   * Creates a new fluent TableConfigBuilder for a specific entity type.
   *
   * @template T - The row entity type.
   */
  createBuilder<T = Record<string, unknown>>(): TableConfigBuilder<T> {
    return new TableConfigBuilder<T>();
  }

  /**
   * Helper to construct a TableConfig directly via a builder callback.
   *
   * @template T - The row entity type.
   * @param builderFn - Callback receiving the builder instance.
   */
  buildConfig<T = Record<string, unknown>>(
    builderFn: (builder: TableConfigBuilder<T>) => void
  ): TableConfig<T> {
    const builder = new TableConfigBuilder<T>();
    builderFn(builder);
    return builder.build();
  }
}

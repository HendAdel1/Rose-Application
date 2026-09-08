import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TableData } from './components/table-data/table-data';
import { TableSearch } from './components/table-search/table-search';
import { TablePagination } from './components/table-pagination/table-pagination';

/**
 * Reusable Dynamic Table Component.
 *
 * Coordinates Search, TableData, and Pagination.
 * Rendered in HTML simply as:
 * ```html
 * <app-reusable-table />
 * ```
 *
 * Configuration is managed in TypeScript via `DataTableService`.
 */
@Component({
  selector: 'app-reusable-table',
  imports: [TableData, TableSearch, TablePagination],
  templateUrl: './reusable-table.html',
  styleUrl: './reusable-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReusableTable {}

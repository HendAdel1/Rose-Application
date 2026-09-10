import { Signal } from '@angular/core';

/**
 * Event emitted when a table page navigation occurs.
 */
export interface TablePageChangeEvent {
  /** 1-based page index */
  page: number;
  /** 0-based index of the first record on the page */
  first: number;
  /** Number of rows displayed per page */
  rows: number;
  /** Total number of pages */
  pageCount: number;
}

/**
 * Configuration options for enabling server-side pagination with DataTableService.
 */
export interface ServerSidePaginationConfig {
  /** Number of rows to display per page (default: 10) */
  pageSize?: number;
  /** Signal providing the total count of records from the server */
  totalRecordsSignal: Signal<number>;
  /** Optional initial page number (1-based, default: 1) */
  initialPage?: number;
  /** Callback triggered when user changes page or page size */
  onPageChange: (page: number, pageSize: number) => void;
}

/**
 * Type of pagination item in the navigation bar.
 */
export type PaginationItemType = 'page' | 'ellipsis-prev' | 'ellipsis-next';

/**
 * Model representing a single button in the pagination list.
 */
export interface PaginationItem {
  type: PaginationItemType;
  value: number;
  display: string;
  isEllipsis: boolean;
  isActive: boolean;
  ariaLabel: string;
}

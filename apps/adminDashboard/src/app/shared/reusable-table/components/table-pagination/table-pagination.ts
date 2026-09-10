import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { Ripple } from 'primeng/ripple';
import { DataTableService } from '../../services/data-table.service';
import {
  PaginationItem,
  TablePageChangeEvent,
} from '../../models/table-pagination.model';

/**
 * Reusable Table Pagination Component.
 *
 * Matches the Figma design pixel-for-pixel using PrimeNG ripple directive and styling:
 * - Rounded square buttons (`«`, `‹`, numeric pages, `...` ellipsis button, `›`, `»`)
 * - Deep crimson/maroon active page button with bold white text
 * - Clickable `...` ellipsis button for page jumping
 * - Reactive integration with `DataTableService` and standalone property bindings
 */
@Component({
  selector: 'app-table-pagination',
  imports: [Ripple],
  templateUrl: './table-pagination.html',
  styleUrl: './table-pagination.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablePagination {
  /** Optional injected DataTableService */
  private readonly dataTableService = inject(DataTableService, { optional: true });

  /** Optional direct 1-based page input */
  page = input<number>();

  /** Optional direct page size (items per page) input */
  pageSize = input<number>();

  /** Optional direct total records input */
  totalRecords = input<number>();

  /** Whether to show first («) and last (») navigation buttons */
  showFirstLastIcon = input<boolean>(true);

  /** Whether to show paginator even if there is only 1 page */
  alwaysShow = input<boolean>(false);

  /** Emitted when page navigation occurs */
  pageChange = output<TablePageChangeEvent>();

  /** Current 1-based page resolved from direct input or DataTableService */
  readonly currentPage = computed<number>(() => {
    const direct = this.page();
    if (direct !== undefined) {
      return direct;
    }
    return this.dataTableService?.page() ?? 1;
  });

  /** Current page size resolved from direct input or DataTableService */
  readonly currentPageSize = computed<number>(() => {
    const direct = this.pageSize();
    if (direct !== undefined) {
      return direct;
    }
    return this.dataTableService?.pageSize() ?? 10;
  });

  /** Total records count resolved from direct input or DataTableService */
  readonly currentTotalRecords = computed<number>(() => {
    const direct = this.totalRecords();
    if (direct !== undefined) {
      return direct;
    }
    return this.dataTableService?.totalRecords() ?? 0;
  });

  /** Total pages calculated reactively */
  readonly totalPages = computed<number>(() => {
    const size = this.currentPageSize();
    if (size <= 0) {
      return 1;
    }
    return Math.ceil(this.currentTotalRecords() / size) || 1;
  });

  /** Zero-based first record index for external tracking */
  readonly first = computed<number>(
    () => (this.currentPage() - 1) * this.currentPageSize()
  );

  /** Determines visibility of paginator */
  readonly showPaginator = computed<boolean>(() => {
    if (this.alwaysShow()) {
      return true;
    }
    return this.currentTotalRecords() > 0 && this.totalPages() > 1;
  });

  /** Indicates whether previous and first buttons should be disabled */
  readonly isFirstDisabled = computed<boolean>(() => this.currentPage() <= 1);

  /** Indicates whether next and last buttons should be disabled */
  readonly isLastDisabled = computed<boolean>(
    () => this.currentPage() >= this.totalPages()
  );

  /**
   * Computed list of pagination buttons matching Figma:
   * Displays 1, 2, 3, '...', 10 when near the start with clickable ellipsis button.
   */
  readonly paginationItems = computed<PaginationItem[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 1) {
      return [];
    }

    if (total <= 4) {
      return Array.from({ length: total }, (_, i) => {
        const pageNum = i + 1;
        return {
          type: 'page',
          value: pageNum,
          display: String(pageNum),
          isEllipsis: false,
          isActive: pageNum === current,
          ariaLabel: `Page ${pageNum}`,
        };
      });
    }

    const items: PaginationItem[] = [];

    // Always include page 1
    items.push({
      type: 'page',
      value: 1,
      display: '1',
      isEllipsis: false,
      isActive: current === 1,
      ariaLabel: 'Page 1',
    });

    if (current <= 3) {
      items.push({
        type: 'page',
        value: 2,
        display: '2',
        isEllipsis: false,
        isActive: current === 2,
        ariaLabel: 'Page 2',
      });
      items.push({
        type: 'page',
        value: 3,
        display: '3',
        isEllipsis: false,
        isActive: current === 3,
        ariaLabel: 'Page 3',
      });
      items.push({
        type: 'ellipsis-next',
        value: Math.min(total, 4),
        display: '...',
        isEllipsis: true,
        isActive: false,
        ariaLabel: 'Next pages',
      });
    } else if (current >= total - 2) {
      items.push({
        type: 'ellipsis-prev',
        value: Math.max(1, total - 3),
        display: '...',
        isEllipsis: true,
        isActive: false,
        ariaLabel: 'Previous pages',
      });
      items.push({
        type: 'page',
        value: total - 2,
        display: String(total - 2),
        isEllipsis: false,
        isActive: current === total - 2,
        ariaLabel: `Page ${total - 2}`,
      });
      items.push({
        type: 'page',
        value: total - 1,
        display: String(total - 1),
        isEllipsis: false,
        isActive: current === total - 1,
        ariaLabel: `Page ${total - 1}`,
      });
    } else {
      items.push({
        type: 'ellipsis-prev',
        value: Math.max(1, current - 2),
        display: '...',
        isEllipsis: true,
        isActive: false,
        ariaLabel: 'Previous pages',
      });
      items.push({
        type: 'page',
        value: current,
        display: String(current),
        isEllipsis: false,
        isActive: true,
        ariaLabel: `Page ${current}`,
      });
      items.push({
        type: 'ellipsis-next',
        value: Math.min(total, current + 2),
        display: '...',
        isEllipsis: true,
        isActive: false,
        ariaLabel: 'Next pages',
      });
    }

    // Always include last page
    items.push({
      type: 'page',
      value: total,
      display: String(total),
      isEllipsis: false,
      isActive: current === total,
      ariaLabel: `Page ${total}`,
    });

    return items;
  });

  /**
   * Navigates to a specific page number.
   *
   * @param page - 1-based page number.
   */
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) {
      return;
    }

    if (this.dataTableService) {
      this.dataTableService.setPage(page);
    }

    const first = (page - 1) * this.currentPageSize();
    this.pageChange.emit({
      page,
      first,
      rows: this.currentPageSize(),
      pageCount: this.totalPages(),
    });
  }

  /** Navigates to the first page */
  goToFirst(): void {
    this.goToPage(1);
  }

  /** Navigates to the previous page */
  goToPrev(): void {
    this.goToPage(this.currentPage() - 1);
  }

  /** Navigates to the next page */
  goToNext(): void {
    this.goToPage(this.currentPage() + 1);
  }

  /** Navigates to the last page */
  goToLast(): void {
    this.goToPage(this.totalPages());
  }

  /** Handles clicking a pagination button (page number or ellipsis button) */
  handleItemClick(item: PaginationItem): void {
    this.goToPage(item.value);
  }
}

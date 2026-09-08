import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { LucideSearch, LucideX } from '@lucide/angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataTableService } from '../../services/data-table.service';

/**
 * Reusable Table Search Component.
 *
 * Provides client-side searching matching the Figma design using PrimeNG input components.
 * Automatically synchronizes with `DataTableService` when provided, or supports standalone
 * two-way `searchQuery` model binding.
 */
@Component({
  selector: 'app-table-search',
  imports: [IconField, InputIcon, InputText, LucideSearch, LucideX, TranslatePipe],
  templateUrl: './table-search.html',
  styleUrl: './table-search.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSearch {
  /** Optional injected DataTableService */
  private readonly dataTableService = inject(DataTableService, { optional: true });

  /** Optional injected TranslateService */
  private readonly translateService = inject(TranslateService, { optional: true });

  /** Placeholder translation key or text */
  placeholder = input<string>('TABLE.SEARCH_PLACEHOLDER');

  /** Two-way bindable search query model */
  searchQuery = model<string>('');

  /** Emitted whenever the search query changes */
  searchChange = output<string>();

  /** Current active search query resolved from model or service */
  readonly currentSearchTerm = computed<string>(() => {
    const local = this.searchQuery();
    if (local) {
      return local;
    }
    return this.dataTableService?.searchTerm() ?? '';
  });

  /**
   * Graceful fallback placeholder if translation file hasn't loaded yet
   * or if the key is missing in any remote context.
   */
  readonly fallbackPlaceholder = computed<string>(() => {
    const isAr = this.translateService?.currentLang() === 'ar';
    return isAr ? 'بحث...' : 'Search...';
  });

  /**
   * Handles user input into the search field.
   *
   * @param event - DOM Input event.
   */
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    const value = target?.value ?? '';
    this.updateSearch(value);
  }

  /**
   * Clears the current search query.
   */
  clearSearch(): void {
    this.updateSearch('');
  }

  private updateSearch(value: string): void {
    this.searchQuery.set(value);
    this.searchChange.emit(value);
    this.dataTableService?.setSearchTerm(value);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LucidePlus } from '@lucide/angular';

/**
 * Reusable Table / Page Header Component.
 *
 * Provides a standardized header layout containing a title, optional primary action button,
 * and content projection slots for additional custom action buttons.
 *
 * @example
 * ```html
 * <app-table-header
 *   title="PRODUCTS.TITLE"
 *   actionLabel="PRODUCTS.ADD_PRODUCT"
 *   (actionClick)="onAddProduct()"
 * />
 * ```
 */
@Component({
  selector: 'app-table-header, app-page-header',
  imports: [TranslatePipe, LucidePlus],
  templateUrl: './table-header.html',
  styleUrl: './table-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHeader {
  /** Title text or translation key (required) */
  title = input.required<string>();

  /** Action button label or translation key (optional) */
  actionLabel = input<string>('');

  /** Action button aria-label or translation key (defaults to actionLabel if not provided) */
  actionAriaLabel = input<string>('');

  /** Whether the primary action button is visible */
  showAction = input<boolean>(true);

  /** Whether the action button displays the plus icon */
  showIcon = input<boolean>(true);

  /** Whether the primary action button is disabled */
  actionDisabled = input<boolean>(false);

  /** Optional additional CSS class for the title element */
  titleClass = input<string>('');

  /** Optional additional CSS class for the action button */
  actionButtonClass = input<string>('');

  /** Emitted when the primary action button is clicked */
  actionClick = output<MouseEvent>();

  /** Resolves the aria-label for accessibility, falling back to actionLabel */
  readonly resolvedAriaLabel = computed<string>(
    () => this.actionAriaLabel() || this.actionLabel()
  );

  /** Determines whether the primary action button should be rendered */
  readonly hasActionButton = computed<boolean>(
    () => this.showAction() && !!this.actionLabel()
  );

  /**
   * Primary action button click handler
   */
  onActionClick(event: MouseEvent): void {
    this.actionClick.emit(event);
  }
}

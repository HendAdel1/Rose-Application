/**
 * Configuration definition for an individual row action button.
 *
 * @template T - The row data type.
 *
 * @example
 * ```typescript
 * const editAction: TableAction<Product> = {
 *   label: 'Edit',
 *   icon: 'lucidePencil',
 *   styleClass: 'edit-btn',
 *   visible: (product) => product.stock > 0,
 * };
 * ```
 */
export interface TableAction<T = Record<string, unknown>> {
  /** Optional action identifier (e.g. 'Edit', 'Delete'). Defaults to mapped action or label. */
  action?: string;

  /** Button label displayed inside the action button or translation key */
  label: string;

  /** Name of the icon to render (e.g. 'lucidePencil', 'lucideTrash2') */
  icon?: string;

  /** Optional CSS class applied to the button for styling (e.g. 'edit-btn', 'delete-btn') */
  styleClass?: string;

  /** Optional predicate to conditionally show or hide this action for a row */
  visible?: (row: T) => boolean;

  /** Optional predicate to conditionally disable this action for a row */
  disabled?: (row: T) => boolean;
}

/**
 * Event payload emitted when a user clicks on an action button.
 *
 * @template T - The row data type.
 *
 * @example
 * ```typescript
 * onAction(event: TableActionEvent<Product>): void {
 *   if (event.action === 'Delete') {
 *     this.productService.deleteProduct(event.row.id);
 *   }
 * }
 * ```
 */
export interface TableActionEvent<T = Record<string, unknown>> {
  /** The label of the action that was triggered (e.g. 'Edit', 'Delete') */
  action: string;

  /** The full row data object */
  row: T;

  /** The 0-indexed position of the row in the dataset */
  rowIndex: number;
}

import { ValidatorFn } from '@angular/forms';

/**
 * Team usage — title + side-by-side layout (12-column grid):
 * ```ts
 * {
 *   title: isAdd ? 'Add a New Category' : `Update Category: ${name}`,
 *   fields: [
 *     { key: 'title', type: 'text', label: 'Title', width: 'full' },
 *     { key: 'price', type: 'number', label: 'Price', width: 'third' },
 *     { key: 'discount', type: 'number', label: 'Discount', width: 'third' },
 *     {
 *       key: 'priceAfterDiscount',
 *       type: 'number',
 *       label: 'Price after discount',
 *       width: 'third',
 *       readonly: true,
 *     },
 *     { key: 'cover', type: 'file', label: 'Cover', width: 'half' },
 *     {
 *       key: 'gallery',
 *       type: 'file',
 *       label: 'Gallery',
 *       width: 'half',
 *       multiple: true,
 *     },
 *   ],
 *   submitLabel: isAdd ? 'Add Category' : 'Update Category',
 * }
 * ```
 * Prefer `width` (`full` | `half` | `third` | `twoThirds` | `quarter`)
 * or set `colSpan` (1–12). Use `breakBefore: true` to force a new row.
 */
export type DynamicFieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'file'
  | 'password';

export type DynamicFieldWidth =
  | 'full'
  | 'half'
  | 'third'
  | 'twoThirds'
  | 'quarter';

export type DynamicFieldColSpan = 1 | 2 | 3 | 4 | 6 | 8 | 12;

export interface DynamicSelectOption {
  value: string;
  label: string;
}

export interface DynamicFieldValidators {
  required?: boolean | string;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string | RegExp;
  patternMessage?: string;
  accept?: string;
  maxSizeMb?: number;
  custom?: ValidatorFn | ValidatorFn[];
}

export interface DynamicFieldConfig {
  key: string;
  type: DynamicFieldType;
  label: string;
  placeholder?: string;
  helperText?: string;
  existingFileUrl?: string;
  existingFileUrls?: string[];
  existingFileLabel?: string;
  replaceLabel?: string;
  options?: readonly DynamicSelectOption[];
  validators?: DynamicFieldValidators;
  disabled?: boolean;
  readonly?: boolean;
  /** Allow selecting multiple files (file fields) */
  multiple?: boolean;
  /** Textarea visible rows */
  rows?: number;
  /** CSS max-height for textarea (e.g. '12rem') */
  maxHeight?: string;
  /**
   * Semantic width shortcut mapped onto the 12-column grid.
   * Defaults to `full` when neither `width` nor `colSpan` is set.
   */
  width?: DynamicFieldWidth;
  /** Explicit grid span (1–12). Wins over `width` when both are set. */
  colSpan?: DynamicFieldColSpan;
  /** Force this field to start on a new row */
  breakBefore?: boolean;
}

export interface DynamicFormConfig {
  /** Page heading shown above the fields (e.g. "Add a New Category") */
  title?: string;
  fields: DynamicFieldConfig[];
  submitLabel: string;
  showCancel?: boolean;
  cancelLabel?: string;
  /** Grid column count (default 12) */
  columns?: 4 | 6 | 12;
}

export type DynamicFormValue = Record<string, unknown>;

export interface DynamicFormSubmitEvent {
  value: DynamicFormValue;
  valid: boolean;
}

export const DYNAMIC_FIELD_WIDTH_SPAN: Record<DynamicFieldWidth, DynamicFieldColSpan> = {
  full: 12,
  half: 6,
  third: 4,
  twoThirds: 8,
  quarter: 3,
};

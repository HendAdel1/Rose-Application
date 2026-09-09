import { ValidatorFn } from '@angular/forms';

export type DynamicFieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'file'
  | 'password';

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
  existingFileLabel?: string;
  replaceLabel?: string;
  options?: readonly DynamicSelectOption[];
  validators?: DynamicFieldValidators;
  disabled?: boolean;
}

export interface DynamicFormConfig {
  fields: DynamicFieldConfig[];
  submitLabel: string;
  showCancel?: boolean;
  cancelLabel?: string;
}

export type DynamicFormValue = Record<string, unknown>;

export interface DynamicFormSubmitEvent {
  value: DynamicFormValue;
  valid: boolean;
}

import { AbstractControl } from '@angular/forms';

export function getCurrentPasswordError(
  control: AbstractControl | null,
): string {
  if (!control?.touched || !control.errors) {
    return '';
  }

  if (control.errors['required']) {
    return 'SETTINGS.CHANGE_PASSWORD.ERRORS.CURRENT_PASSWORD_REQUIRED';
  }

  return '';
}

export function getNewPasswordError(control: AbstractControl | null): string {
  if (!control?.touched || !control.errors) {
    return '';
  }

  if (control.errors['required']) {
    return 'SETTINGS.CHANGE_PASSWORD.ERRORS.NEW_PASSWORD_REQUIRED';
  }

  if (control.errors['passwordStrength']) {
    return 'SETTINGS.CHANGE_PASSWORD.ERRORS.PASSWORD_STRENGTH';
  }

  return '';
}

export function getConfirmPasswordError(
  control: AbstractControl | null,
  form: AbstractControl | null,
): string {
  if (!control?.touched) {
    return '';
  }

  if (control.errors?.['required']) {
    return 'SETTINGS.CHANGE_PASSWORD.ERRORS.CONFIRM_PASSWORD_REQUIRED';
  }

  if (form?.errors?.['passwordMismatch']) {
    return 'SETTINGS.CHANGE_PASSWORD.ERRORS.PASSWORD_MISMATCH';
  }

  return '';
}

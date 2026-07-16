import { AbstractControl } from '@angular/forms';

export function getRequiredError(
  control: AbstractControl | null,
  message = 'This field is required'
): string {
  if (!control?.touched || !control.errors?.['required']) {
    return '';
  }

  return message;
}

export function getEmailError(control: AbstractControl | null): string {
  if (!control?.touched || !control.errors) {
    return '';
  }

  if (control.errors['required']) {
    return 'Email is required';
  }

  if (control.errors['email']) {
    return 'Please enter a valid email address';
  }

  return '';
}

export function getPasswordError(control: AbstractControl | null): string {
  if (!control?.touched || !control.errors) {
    return '';
  }

  if (control.errors['required']) {
    return 'Password is required';
  }

  if (control.errors['passwordStrength']) {
    return 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';
  }

  return '';
}

export function getConfirmPasswordError(
  control: AbstractControl | null,
  form: AbstractControl | null
): string {
  if (!control?.touched) {
    return '';
  }

  if (control.errors?.['required']) {
    return 'Please confirm your password';
  }

  if (form?.errors?.['passwordMismatch']) {
    return 'Passwords do not match';
  }

  return '';
}

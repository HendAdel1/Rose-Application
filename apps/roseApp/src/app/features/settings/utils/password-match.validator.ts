import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(
  passwordControl = 'newPassword',
  confirmPasswordControl = 'confirmPassword',
): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const password = form.get(passwordControl)?.value;
    const confirmPassword = form.get(confirmPasswordControl)?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}

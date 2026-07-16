import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const STRONG_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const passwordStrengthValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = (control.value ?? '') as string;

  if (!value) {
    return null;
  }

  return STRONG_PASSWORD.test(value) ? null : { passwordStrength: true };
};

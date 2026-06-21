import { TranslateService } from '@ngx-translate/core';

const ERROR_KEYS: Record<string, string> = {
  'Email is required': 'AUTH.ERRORS.EMAIL_REQUIRED',
  'Please enter a valid email address': 'AUTH.ERRORS.EMAIL_INVALID',
  'First name is required': 'AUTH.ERRORS.FIRST_NAME_REQUIRED',
  'Last name is required': 'AUTH.ERRORS.LAST_NAME_REQUIRED',
  'Please select your gender': 'AUTH.ERRORS.GENDER_REQUIRED',
  'Password is required': 'AUTH.ERRORS.PASSWORD_REQUIRED',
  'Please confirm your password': 'AUTH.ERRORS.CONFIRM_PASSWORD_REQUIRED',
  'Passwords do not match': 'AUTH.ERRORS.PASSWORD_MISMATCH',
};

export function translateRegisterFieldError(
  translate: TranslateService,
  error: string
): string {
  return error ? translate.instant(ERROR_KEYS[error] ?? error) : '';
}

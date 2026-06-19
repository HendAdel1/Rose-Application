import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthApiService, LoadingService } from '@org/auth-data-access';
import { CustomInput, UiButton } from '@org/sharedComponents';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, catchError } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { passwordMatchValidator } from '../../shared/utils/password-match.validator';
import { passwordStrengthValidator } from '../../shared/utils/password-strength.validator';
import {
  getConfirmPasswordError,
  getPasswordError,
} from '../../shared/utils/form-field-errors';

@Component({
  selector: 'app-reset-password-form',
  imports: [ReactiveFormsModule, CustomInput, UiButton, TranslatePipe],
  templateUrl: './reset-password-form.html',
})
export class ResetPasswordForm {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);

  readonly loading = inject(LoadingService);
  private readonly resetToken =
    this.route.snapshot.queryParamMap.get('token') ?? '';

  resetPasswordForm: FormGroup = this.fb.group(
    {
      password: ['', [Validators.required, passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator() }
  );

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    if (!this.resetToken) {
      this.toastr.error(
        this.translate.instant('AUTH.RESET.INVALID_LINK'),
        this.translate.instant('AUTH.RESET.FAILED')
      );
      return;
    }

    const { password, confirmPassword } = this.resetPasswordForm.getRawValue();

    this.authApi
      .resetPassword({
        token: this.resetToken,
        newPassword: password,
        confirmPassword,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => EMPTY)
      )
      .subscribe((response) => {
        this.toastr.success(
          response.message || this.translate.instant('AUTH.RESET.SUCCESS'),
          this.translate.instant('AUTH.RESET.SUCCESS_TITLE')
        );
        this.resetPasswordForm.reset();
        this.redirectToLogin();
      });
  }

  passwordError(): string {
    const error = getPasswordError(this.resetPasswordForm.get('password'));

    if (error === 'Password is required') {
      return this.translate.instant('AUTH.ERRORS.PASSWORD_REQUIRED');
    }

    if (error.startsWith('Password must be')) {
      return this.translate.instant('AUTH.ERRORS.PASSWORD_STRENGTH');
    }

    return error;
  }

  confirmPasswordError(): string {
    const error = getConfirmPasswordError(
      this.resetPasswordForm.get('confirmPassword'),
      this.resetPasswordForm
    );

    if (error === 'Please confirm your password') {
      return this.translate.instant('AUTH.ERRORS.CONFIRM_PASSWORD_REQUIRED');
    }

    if (error === 'Passwords do not match') {
      return this.translate.instant('AUTH.ERRORS.PASSWORD_MISMATCH');
    }

    return error;
  }

  private redirectToLogin(): void {
    void this.router.navigate(['../login'], { relativeTo: this.route });
  }
}

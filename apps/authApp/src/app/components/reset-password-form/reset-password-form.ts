import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthApiService, LoadingService } from '@org/auth-data-access';
import { CustomInput, UiButton, UiToast } from '@org/sharedComponents';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, catchError } from 'rxjs';

import { passwordMatchValidator } from '../../shared/utils/password-match.validator';
import { passwordStrengthValidator } from '../../shared/utils/password-strength.validator';
import {
  getConfirmPasswordError,
  getPasswordError,
} from '../../shared/utils/form-field-errors';

@Component({
  selector: 'app-reset-password-form',
  imports: [ReactiveFormsModule, CustomInput, UiButton, UiToast],
  templateUrl: './reset-password-form.html',
})
export class ResetPasswordForm {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastr = inject(ToastrService);

  readonly loading = inject(LoadingService);
  showToast = signal(false);
  toastMessage = signal('');

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
    this.showToast.set(false);

    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    if (!this.resetToken) {
      this.toastr.error(
        'Reset link is invalid or expired. Please request a new password reset.',
        'Reset failed'
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
        this.toastMessage.set(
          response.message || 'Your password has been reset successfully.'
        );
        this.showToast.set(true);
        this.resetPasswordForm.reset();
        this.scheduleLoginRedirect();
      });
  }

  onToastDismiss(): void {
    this.showToast.set(false);
    this.redirectToLogin();
  }

  passwordError(): string {
    return getPasswordError(this.resetPasswordForm.get('password'));
  }

  confirmPasswordError(): string {
    return getConfirmPasswordError(
      this.resetPasswordForm.get('confirmPassword'),
      this.resetPasswordForm
    );
  }

  private scheduleLoginRedirect(): void {
    window.setTimeout(() => this.redirectToLogin(), 3000);
  }

  private redirectToLogin(): void {
    void this.router.navigate(['../login'], { relativeTo: this.route });
  }
}
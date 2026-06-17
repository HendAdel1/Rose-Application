import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthApiService, AuthError } from '@org/auth-data-access';
import { CustomInput, UiButton, UiErrorMessage, UiLabel, UiToast } from '@org/sharedComponents';
import { finalize } from 'rxjs';
import { passwordMatchValidator, passwordStrengthValidator } from '../../shared/validators/password.validators';
@Component({
  selector: 'app-reset-password-form',
  imports: [ReactiveFormsModule, CustomInput, UiLabel, UiButton, UiErrorMessage, UiToast],
  templateUrl: './reset-password-form.html',
})
export class ResetPasswordForm {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  isLoading = signal(false);
  isError = signal(false);
  showToast = signal(false);
  errorMessage = signal('');
  toastMessage = signal('');

  private readonly resetToken =
    this.route.snapshot.queryParamMap.get('token') ?? '';

  resetPasswordForm: FormGroup = this.fb.group(
    {
      password: ['', [Validators.required, passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );

  onSubmit(): void {
    this.isError.set(false);
    this.errorMessage.set('');
    this.showToast.set(false);

    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    if (!this.resetToken) {
      this.isError.set(true);
      this.errorMessage.set(
        'Reset link is invalid or expired. Please request a new password reset.'
      );
      return;
    }

    const { password, confirmPassword } = this.resetPasswordForm.getRawValue();

    this.isLoading.set(true);

    this.authApi
      .resetPassword({
        token: this.resetToken,
        newPassword: password,
        confirmPassword,
      })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.toastMessage.set(
            response.message || 'Your password has been reset successfully.'
          );
          this.showToast.set(true);
          this.resetPasswordForm.reset();
          this.scheduleLoginRedirect();
        },
        error: (error: AuthError) => {
          this.isError.set(true);
          this.errorMessage.set(error.message);
        },
      });
  }

  onToastDismiss(): void {
    this.showToast.set(false);
    this.redirectToLogin();
  }

  passwordError(): string {
    const control = this.resetPasswordForm.get('password');

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

  confirmPasswordError(): string {
    const control = this.resetPasswordForm.get('confirmPassword');

    if (!control?.touched) {
      return '';
    }

    if (control.errors?.['required']) {
      return 'Please confirm your password';
    }

    if (this.resetPasswordForm.errors?.['passwordMismatch']) {
      return 'Passwords do not match';
    }

    return '';
  }

  private scheduleLoginRedirect(): void {
    window.setTimeout(() => this.redirectToLogin(), 3000);
  }

  private redirectToLogin(): void {
    void this.router.navigate(['../login'], { relativeTo: this.route });
  }
}
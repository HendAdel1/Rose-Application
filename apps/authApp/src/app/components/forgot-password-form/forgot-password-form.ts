import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthApiService, AuthError } from '@org/auth-data-access';
import { CustomInput, UiButton, UiErrorMessage, UiLabel } from '@org/sharedComponents';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [ReactiveFormsModule, CustomInput, UiLabel, UiButton, UiErrorMessage],
  templateUrl: './forgot-password-form.html',
})
export class ForgotPasswordForm {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApiService);

  isLoading = signal(false);
  isError = signal(false);
  isSuccess = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  forgotPasswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    this.isError.set(false);
    this.isSuccess.set(false);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    const { email } = this.forgotPasswordForm.getRawValue();

    this.isLoading.set(true);

    this.authApi
      .forgotPassword({ email })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.isSuccess.set(true);
          this.successMessage.set(
            response.message ||
              'Password reset instructions have been sent to your email.'
          );
          this.forgotPasswordForm.reset();
        },
        error: (error: AuthError) => {
          this.isError.set(true);
          this.errorMessage.set(error.message);
        },
      });
  }

  emailError(): string {
    const control = this.forgotPasswordForm.get('email');

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
}
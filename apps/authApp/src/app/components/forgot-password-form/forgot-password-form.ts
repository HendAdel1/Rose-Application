import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthApiService, LoadingService } from '@org/auth-data-access';
import { CustomInput, UiButton, UiLabel } from '@org/sharedComponents';
import { EMPTY, catchError } from 'rxjs';

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [ReactiveFormsModule, CustomInput, UiLabel, UiButton],
  templateUrl: './forgot-password-form.html',
})
export class ForgotPasswordForm {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly loading = inject(LoadingService);
  readonly isSuccess = signal(false);
  readonly successMessage = signal('');

  forgotPasswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    this.isSuccess.set(false);
    this.successMessage.set('');

    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    const { email } = this.forgotPasswordForm.getRawValue();

    this.authApi
      .forgotPassword({ email })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => EMPTY)
      )
      .subscribe((response) => {
        this.isSuccess.set(true);
        this.successMessage.set(
          response.message ||
            'Password reset instructions have been sent to your email.'
        );
        this.forgotPasswordForm.reset();
        this.router.navigate(['../reset-link'], {
          relativeTo: this.route,
          state: { email },
        });
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

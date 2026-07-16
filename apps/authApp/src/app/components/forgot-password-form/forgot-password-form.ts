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
import { CustomInput, UiButton } from '@org/sharedComponents';
import { EMPTY, catchError } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { getEmailError } from '../../shared/utils/form-field-errors';

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [ReactiveFormsModule, CustomInput, UiButton, TranslatePipe],
  templateUrl: './forgot-password-form.html',
})
export class ForgotPasswordForm {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

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
            this.translate.instant('AUTH.FORGOT.SUCCESS')
        );
        this.forgotPasswordForm.reset();
        this.router.navigate(['../reset-link'], {
          relativeTo: this.route,
          state: { email },
        });
      });
  }

  emailError(): string {
    const error = getEmailError(this.forgotPasswordForm.get('email'));

    if (error === 'Email is required') {
      return this.translate.instant('AUTH.ERRORS.EMAIL_REQUIRED');
    }

    if (error === 'Please enter a valid email address') {
      return this.translate.instant('AUTH.ERRORS.EMAIL_INVALID');
    }

    return error;
  }
}

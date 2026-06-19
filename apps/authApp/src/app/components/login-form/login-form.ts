import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService, LoadingService, TokenStorageService } from '@org/auth-data-access';
import { CustomInput, UiButton } from '@org/sharedComponents';
import { EMPTY, catchError } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import {
  getEmailError,
  getPasswordError,
} from '../../shared/utils/form-field-errors';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CustomInput, UiButton, TranslatePipe],
  templateUrl: './login-form.html',
})
export class LoginForm {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApiService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);

  readonly loading = inject(LoadingService);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.authApi
      .login({
        username: email,
        password,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => EMPTY),
      )
      .subscribe((response) => {
        this.tokenStorage.saveAuthPayload(response.payload);
        void this.router.navigate(['/roseApp']);
      });
  }

  emailError(): string {
    const error = getEmailError(this.loginForm.get('email'));

    if (error === 'Email is required') {
      return this.translate.instant('AUTH.ERRORS.EMAIL_REQUIRED');
    }

    if (error === 'Please enter a valid email address') {
      return this.translate.instant('AUTH.ERRORS.EMAIL_INVALID');
    }

    return error;
  }

  passwordError(): string {
    const error = getPasswordError(this.loginForm.get('password'));

    return error === 'Password is required'
      ? this.translate.instant('AUTH.ERRORS.PASSWORD_REQUIRED')
      : error;
  }
}

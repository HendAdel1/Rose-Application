import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService, LoadingService, TokenStorageService } from '@org/auth-data-access';
import { CustomInput, UiButton } from '@org/sharedComponents';
import { EMPTY, catchError } from 'rxjs';

import {
  getEmailError,
  getPasswordError,
} from '../../shared/utils/form-field-errors';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CustomInput, UiButton],
  templateUrl: './login-form.html',
})
export class LoginForm {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApiService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

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
    return getEmailError(this.loginForm.get('email'));
  }

  passwordError(): string {
    return getPasswordError(this.loginForm.get('password'));
  }
}

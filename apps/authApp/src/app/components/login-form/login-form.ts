import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthSessionService, LoadingService } from '@org/auth-data-access';
import { CustomInput, UiButton } from '@org/sharedComponents';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, catchError } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import {
  getPasswordError,
  getRequiredError,
} from '../../shared/utils/form-field-errors';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CustomInput, UiButton, TranslatePipe],
  templateUrl: './login-form.html',
})
export class LoginForm {
  private readonly fb = inject(FormBuilder);
  private readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);
  private readonly toastr = inject(ToastrService);

  readonly loading = inject(LoadingService);

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.getRawValue();

    this.authSession
      .login({
        username,
        password,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => EMPTY),
      )
      .subscribe(() => {
        this.toastr.success(
          this.translate.instant('AUTH.LOGIN_TOAST.SUCCESS'),
          this.translate.instant('AUTH.LOGIN_TOAST.SUCCESS_TITLE')
        );
        void this.router.navigate(['/roseApp']);
      });
  }

  usernameError(): string {
    const error = getRequiredError(
      this.loginForm.get('username'),
      'Username is required'
    );

    return error
      ? this.translate.instant('AUTH.ERRORS.USERNAME_REQUIRED')
      : '';
  }

  passwordError(): string {
    const error = getPasswordError(this.loginForm.get('password'));

    return error === 'Password is required'
      ? this.translate.instant('AUTH.ERRORS.PASSWORD_REQUIRED')
      : error;
  }
}

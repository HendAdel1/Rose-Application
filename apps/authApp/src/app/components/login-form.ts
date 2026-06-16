import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  AuthApiService,
  AuthError,
  TokenStorageService,
} from '@org/auth-data-access';
import {
  CustomInput,
  UiButton,
  UiErrorMessage,
  UiLabel,
} from '@org/sharedComponents';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CustomInput,
    UiLabel,
    UiButton,
    UiErrorMessage,
  ],
  templateUrl: './login-form.html',
})
export class LoginForm {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApiService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly router = inject(Router);

  isLoading = signal(false);
  isError = signal(false);
  errorMessage = signal('');

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  onSubmit(): void {
    this.isError.set(false);
    this.errorMessage.set('');

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.isLoading.set(true);

    this.authApi.login({
        username: email,
        password,
      })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.tokenStorage.saveAuthPayload(response.payload);
          void this.router.navigate(['/roseApp']);
        },
        error: (error: AuthError) => {
          this.isError.set(true);
          this.errorMessage.set(error.message);
        },
      });
  }

  emailError(): string {
    const control = this.loginForm.get('email');

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

  passwordError(): string {
    const control = this.loginForm.get('password');

    if (!control?.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'Password is required';
    }

    return '';
  }
}

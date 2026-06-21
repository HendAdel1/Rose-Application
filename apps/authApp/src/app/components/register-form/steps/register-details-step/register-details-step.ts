import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  AuthApiService,
  LoadingService,
  RegisterRequest,
} from '@org/auth-data-access';
import { CustomInput, CustomInputOption, UiButton } from '@org/sharedComponents';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, catchError } from 'rxjs';

import {
  getConfirmPasswordError,
  getEmailError,
  getPasswordError,
  getRequiredError,
} from '../../../../shared/utils/form-field-errors';
import { passwordMatchValidator } from '../../../../shared/utils/password-match.validator';
import { translateRegisterFieldError } from '../../utils/register-field-errors';

@Component({
  selector: 'app-register-details-step',
  imports: [ReactiveFormsModule, CustomInput, UiButton, TranslatePipe],
  templateUrl: './register-details-step.html',
})
export class RegisterDetailsStep implements OnInit {
  verificationEmail = input.required<string>();

  private readonly authApi = inject(AuthApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly toastr = inject(ToastrService);

  readonly loading = inject(LoadingService);

  readonly registerForm = new FormGroup(
    {
      username: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      gender: new FormControl<'MALE' | 'FEMALE' | ''>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: passwordMatchValidator() }
  );

  ngOnInit(): void {
    this.registerForm.controls.email.setValue(this.verificationEmail());
    this.registerForm.controls.email.disable();
  }

  get genderOptions(): readonly CustomInputOption[] {
    return [
      { value: 'MALE', label: this.translate.instant('AUTH.REGISTER.MALE') },
      { value: 'FEMALE', label: this.translate.instant('AUTH.REGISTER.FEMALE') },
    ];
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const request = {
      ...this.registerForm.getRawValue(),
      email: this.verificationEmail(),
    } as RegisterRequest;

    this.authApi
      .register(request)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => EMPTY)
      )
      .subscribe((response) => {
        this.toastr.success(
          response.message || this.translate.instant('AUTH.REGISTER.SUCCESS'),
          this.translate.instant('AUTH.REGISTER.SUCCESS_TITLE')
        );
        void this.router.navigate(['/authApp/login']);
      });
  }

  firstNameError(): string {
    return translateRegisterFieldError(
      this.translate,
      getRequiredError(
        this.registerForm.controls.firstName,
        'First name is required'
      )
    );
  }

  lastNameError(): string {
    return translateRegisterFieldError(
      this.translate,
      getRequiredError(
        this.registerForm.controls.lastName,
        'Last name is required'
      )
    );
  }

  usernameError(): string {
    const control = this.registerForm.controls.username;

    if (!control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return this.translate.instant('AUTH.ERRORS.USERNAME_REQUIRED');
    }

    if (control.errors['minlength']) {
      return this.translate.instant('AUTH.ERRORS.USERNAME_MIN');
    }

    if (control.errors['maxlength']) {
      return this.translate.instant('AUTH.ERRORS.USERNAME_MAX');
    }

    return '';
  }

  registerEmailError(): string {
    return translateRegisterFieldError(
      this.translate,
      getEmailError(this.registerForm.controls.email)
    );
  }

  genderError(): string {
    return translateRegisterFieldError(
      this.translate,
      getRequiredError(
        this.registerForm.controls.gender,
        'Please select your gender'
      )
    );
  }

  passwordError(): string {
    return translateRegisterFieldError(
      this.translate,
      getPasswordError(this.registerForm.controls.password)
    );
  }

  confirmPasswordError(): string {
    return translateRegisterFieldError(
      this.translate,
      getConfirmPasswordError(
        this.registerForm.controls.confirmPassword,
        this.registerForm
      )
    );
  }
}

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  AuthApiService,
  LoadingService,
  RegisterRequest,
} from '@org/auth-data-access';
import { CustomInput, CustomInputOption, UiButton } from '@org/sharedComponents';
import { EMPTY, catchError } from 'rxjs';

import {
  getConfirmPasswordError,
  getEmailError,
  getPasswordError,
  getRequiredError,
} from '../../shared/utils/form-field-errors';
import { passwordMatchValidator } from '../../shared/utils/password-match.validator';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, CustomInput, UiButton],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm implements OnInit {
  readonly step = signal(1);
  readonly verificationEmail = signal('');
  readonly timer = signal(0);
  readonly expirationTimer = signal(0);
  readonly feedbackMessage = signal<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  @Input() length = 6;
  @Input() cooldownTime = 60;
  @Input() expirationTime = 600;

  @ViewChildren('otpInput')
  inputElements!: QueryList<ElementRef<HTMLInputElement>>;

  readonly otpFormArray = new FormArray<FormControl<string>>([]);
  readonly loading = inject(LoadingService);

  readonly genderOptions: readonly CustomInputOption[] = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
  ];

  private readonly authApiService = inject(AuthApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly verifyEmail = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  readonly confirmEmail = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    code: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d{6}$/)],
    }),
  });

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
    for (let index = 0; index < this.length; index += 1) {
      this.otpFormArray.push(
        new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.pattern(/^\d$/)],
        })
      );
    }
  }

  sendEmailVerification(): void {
    if (this.verifyEmail.invalid) {
      this.verifyEmail.markAllAsTouched();
      return;
    }

    const email = this.verifyEmail.controls.email.value.trim().toLowerCase();
    this.verifyEmail.controls.email.setValue(email);

    this.authApiService
      .sendEmailVerification({ email })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => EMPTY)
      )
      .subscribe(() => {
        this.verificationEmail.set(email);
        this.confirmEmail.controls.email.setValue(email);
        this.registerForm.controls.email.setValue(email);
        this.step.set(2);
        this.startVerificationTimers();
      });
  }

  onSubmit(): void {
    if (this.otpFormArray.invalid) {
      this.feedbackMessage.set({
        type: 'error',
        text: 'Please fill out all verification boxes.',
      });
      return;
    }

    const code = this.otpFormArray.getRawValue().join('');
    this.confirmEmail.controls.code.setValue(code);
    this.confirmEmailVerification();
  }

  confirmEmailVerification(): void {
    const email = this.verificationEmail();
    const code = this.confirmEmail.controls.code.value.trim();

    if (!email || !code || this.confirmEmail.invalid) {
      this.feedbackMessage.set({
        type: 'error',
        text: 'Enter the complete verification code.',
      });
      return;
    }

    this.feedbackMessage.set(null);

    this.authApiService
      .confirmEmailVerification({ email, code })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => EMPTY)
      )
      .subscribe(() => this.step.set(3));
  }

  handleResend(): void {
    if (this.timer() > 0 || this.loading.isLoading()) {
      return;
    }

    const email = this.verificationEmail();
    if (!email) {
      return;
    }

    this.feedbackMessage.set(null);

    this.authApiService
      .sendEmailVerification({ email })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => EMPTY)
      )
      .subscribe(() => {
        this.feedbackMessage.set({
          type: 'success',
          text: 'A fresh security code has been sent.',
        });
        this.otpFormArray.reset();
        this.startVerificationTimers();

        setTimeout(
          () => this.inputElements.toArray()[0]?.nativeElement.focus(),
          50
        );
      });
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const request = this.registerForm.getRawValue() as RegisterRequest;

    this.authApiService
      .register(request)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => EMPTY)
      )
      .subscribe(() => this.router.navigate(['/auth/login']));
  }

  onInputChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(-1);

    this.otpFormArray.at(index).setValue(value, { emitEvent: false });
    input.value = value;

    if (value && index < this.length - 1) {
      this.inputElements.toArray()[index + 1]?.nativeElement.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key !== 'Backspace') {
      return;
    }

    const currentControl = this.otpFormArray.at(index);
    if (!currentControl.value && index > 0) {
      this.otpFormArray.at(index - 1).setValue('');
      this.inputElements.toArray()[index - 1]?.nativeElement.focus();
      return;
    }

    currentControl.setValue('');
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const digits = (event.clipboardData?.getData('text') ?? '')
      .replace(/\D/g, '')
      .slice(0, this.length);

    digits.split('').forEach((digit, index) => {
      this.otpFormArray.at(index)?.setValue(digit);
    });

    const targetIndex = Math.min(digits.length, this.length - 1);
    this.inputElements.toArray()[targetIndex]?.nativeElement.focus();
  }

  getFormattedExpirationTime(): string {
    const minutes = Math.floor(this.expirationTimer() / 60);
    const seconds = this.expirationTimer() % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  verifyEmailError(): string {
    return getEmailError(this.verifyEmail.controls.email);
  }

  firstNameError(): string {
    return getRequiredError(
      this.registerForm.controls.firstName,
      'First name is required'
    );
  }

  lastNameError(): string {
    return getRequiredError(
      this.registerForm.controls.lastName,
      'Last name is required'
    );
  }

  usernameError(): string {
    const control = this.registerForm.controls.username;

    if (!control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'Username is required';
    }

    if (control.errors['minlength']) {
      return 'Username must be at least 3 characters';
    }

    if (control.errors['maxlength']) {
      return 'Username must be at most 20 characters';
    }

    return '';
  }

  registerEmailError(): string {
    return getEmailError(this.registerForm.controls.email);
  }

  genderError(): string {
    return getRequiredError(
      this.registerForm.controls.gender,
      'Please select your gender'
    );
  }

  passwordError(): string {
    return getPasswordError(this.registerForm.controls.password);
  }

  confirmPasswordError(): string {
    return getConfirmPasswordError(
      this.registerForm.controls.confirmPassword,
      this.registerForm
    );
  }

  private startVerificationTimers(): void {
    this.timer.set(this.cooldownTime);
    this.expirationTimer.set(this.expirationTime);
    this.startCountdown(this.timer);
    this.startCountdown(this.expirationTimer);
  }

  private startCountdown(counter: typeof this.timer): void {
    const intervalId = setInterval(() => {
      if (counter() <= 0) {
        clearInterval(intervalId);
        return;
      }

      counter.update((value) => value - 1);
    }, 1000);
  }
}

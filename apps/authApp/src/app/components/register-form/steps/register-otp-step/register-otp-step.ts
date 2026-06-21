import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
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
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthApiService, LoadingService } from '@org/auth-data-access';
import { UiButton } from '@org/sharedComponents';
import { EMPTY, catchError } from 'rxjs';

@Component({
  selector: 'app-register-otp-step',
  imports: [ReactiveFormsModule, UiButton, TranslatePipe],
  templateUrl: './register-otp-step.html',
  styleUrl: './register-otp-step.css',
})
export class RegisterOtpStep implements OnInit {
  email = input.required<string>();
  length = input<number>(6);
  cooldownTime = input<number>(60);
  expirationTime = input<number>(600);

  readonly completed = output<void>();

  private readonly authApi = inject(AuthApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);

  readonly loading = inject(LoadingService);
  readonly timer = signal(0);
  readonly expirationTimer = signal(0);
  readonly feedbackMessage = signal<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  readonly otpFormArray = new FormArray<FormControl<string>>([]);
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

  @ViewChildren('otpInput')
  private readonly inputElements!: QueryList<ElementRef<HTMLInputElement>>;

  ngOnInit(): void {
    for (let index = 0; index < this.length(); index += 1) {
      this.otpFormArray.push(
        new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.pattern(/^\d$/)],
        })
      );
    }

    this.confirmEmail.controls.email.setValue(this.email());
    this.startVerificationTimers();
  }

  onSubmit(): void {
    if (this.otpFormArray.invalid) {
      this.feedbackMessage.set({
        type: 'error',
        text: this.translate.instant('AUTH.ERRORS.OTP_REQUIRED'),
      });
      return;
    }

    const code = this.otpFormArray.getRawValue().join('');
    this.confirmEmail.controls.code.setValue(code);
    this.confirmEmailVerification();
  }

  handleResend(): void {
    if (this.timer() > 0 || this.loading.isLoading()) {
      return;
    }

    this.feedbackMessage.set(null);

    this.authApi
      .sendEmailVerification({ email: this.email() })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => EMPTY)
      )
      .subscribe(() => {
        this.feedbackMessage.set({
          type: 'success',
          text: this.translate.instant('AUTH.REGISTER.OTP_RESENT'),
        });
        this.otpFormArray.reset();
        this.startVerificationTimers();
        setTimeout(() => this.focusFirstInput(), 50);
      });
  }

  onInputChange(event: Event, index: number): void {
    const inputEl = event.target as HTMLInputElement;
    const value = inputEl.value.replace(/\D/g, '').slice(-1);

    this.otpFormArray.at(index).setValue(value, { emitEvent: false });
    inputEl.value = value;

    if (value && index < this.length() - 1) {
      this.focusInputAt(index + 1);
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key !== 'Backspace') {
      return;
    }

    const currentControl = this.otpFormArray.at(index);
    if (!currentControl.value && index > 0) {
      this.otpFormArray.at(index - 1).setValue('');
      this.focusInputAt(index - 1);
      return;
    }

    currentControl.setValue('');
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const digits = (event.clipboardData?.getData('text') ?? '')
      .replace(/\D/g, '')
      .slice(0, this.length());

    digits.split('').forEach((digit, index) => {
      this.otpFormArray.at(index)?.setValue(digit);
    });

    this.focusInputAt(Math.min(digits.length, this.length() - 1));
  }

  getFormattedExpirationTime(): string {
    const minutes = Math.floor(this.expirationTimer() / 60);
    const seconds = this.expirationTimer() % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  focusFirstInput(): void {
    this.focusInputAt(0);
  }

  private focusInputAt(index: number): void {
    this.inputElements.get(index)?.nativeElement.focus();
  }

  private confirmEmailVerification(): void {
    const code = this.confirmEmail.controls.code.value.trim();

    if (!code || this.confirmEmail.invalid) {
      this.feedbackMessage.set({
        type: 'error',
        text: this.translate.instant('AUTH.ERRORS.OTP_COMPLETE'),
      });
      return;
    }

    this.feedbackMessage.set(null);

    this.authApi
      .confirmEmailVerification({ email: this.email(), code })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => EMPTY)
      )
      .subscribe(() => this.completed.emit());
  }

  private startVerificationTimers(): void {
    this.timer.set(this.cooldownTime());
    this.expirationTimer.set(this.expirationTime());
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

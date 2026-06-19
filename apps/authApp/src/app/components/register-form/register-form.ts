import {
  Component,
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
import { AuthApiService, AuthError } from '@org/auth-data-access';
import { CustomInput, UiButton, UiLabel } from '@org/sharedComponents';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-register-form',
  imports: [
    ReactiveFormsModule,
    CustomInput,
    UiLabel,
    UiButton,
    InputMaskModule,
    MessageModule,
    InputTextModule,
  ],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm implements OnInit {
  readonly step = signal(1);
  readonly msgError = signal('');
  readonly isLoading = signal(false);
  readonly verificationEmail = signal('');
  readonly timer = signal(0);
  readonly expirationTimer = signal(0);
  readonly isResending = signal(false);
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
  private readonly authApiService = inject(AuthApiService);

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
    this.msgError.set('');

    if (this.verifyEmail.invalid) {
      this.verifyEmail.markAllAsTouched();
      return;
    }

    const email = this.verifyEmail.controls.email.value.trim().toLowerCase();
    this.verifyEmail.controls.email.setValue(email);
    this.isLoading.set(true);

    this.authApiService.sendEmailVerification({ email }).subscribe({
      next: (response) => {
        this.isLoading.set(false);

        if (!response.status) {
          this.msgError.set(
            response.message || 'Unable to send the verification code.'
          );
          return;
        }

        this.verificationEmail.set(email);
        this.confirmEmail.controls.email.setValue(email);
        this.step.set(2);
        this.startVerificationTimers();
      },
      error: (error: AuthError) => {
        this.isLoading.set(false);
        this.msgError.set(error.message);
      },
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

    this.isLoading.set(true);
    this.feedbackMessage.set(null);

    this.authApiService.confirmEmailVerification({ email, code }).subscribe({
      next: (response) => {
        this.isLoading.set(false);

        if (!response.status) {
          this.feedbackMessage.set({
            type: 'error',
            text: response.message || 'Unable to verify the code.',
          });
          return;
        }

        this.step.set(3);
      },
      error: (error: AuthError) => {
        this.isLoading.set(false);
        this.feedbackMessage.set({ type: 'error', text: error.message });
      },
    });
  }

  handleResend(): void {
    if (this.timer() > 0 || this.isResending()) {
      return;
    }

    const email = this.verificationEmail();
    if (!email) {
      return;
    }

    this.isResending.set(true);
    this.feedbackMessage.set(null);

    this.authApiService.sendEmailVerification({ email }).subscribe({
      next: (response) => {
        this.isResending.set(false);

        if (!response.status) {
          this.feedbackMessage.set({
            type: 'error',
            text: response.message || 'Unable to resend the verification code.',
          });
          return;
        }

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
      },
      error: (error: AuthError) => {
        this.isResending.set(false);
        this.feedbackMessage.set({ type: 'error', text: error.message });
      },
    });
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

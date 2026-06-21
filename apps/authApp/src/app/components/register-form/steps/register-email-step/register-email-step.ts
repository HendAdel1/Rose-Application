import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, inject, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthApiService, LoadingService } from '@org/auth-data-access';
import { CustomInput, UiButton } from '@org/sharedComponents';
import { EMPTY, catchError } from 'rxjs';

import { getEmailError } from '../../../../shared/utils/form-field-errors';
import { translateRegisterFieldError } from '../../utils/register-field-errors';

@Component({
  selector: 'app-register-email-step',
  imports: [ReactiveFormsModule, CustomInput, UiButton, TranslatePipe],
  templateUrl: './register-email-step.html',
})
export class RegisterEmailStep {
  private readonly authApi = inject(AuthApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);

  readonly loading = inject(LoadingService);
  readonly completed = output<string>();

  readonly verifyEmail = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  sendEmailVerification(): void {
    if (this.verifyEmail.invalid) {
      this.verifyEmail.markAllAsTouched();
      return;
    }

    const email = this.verifyEmail.controls.email.value.trim().toLowerCase();
    this.verifyEmail.controls.email.setValue(email);

    this.authApi
      .sendEmailVerification({ email })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => EMPTY)
      )
      .subscribe(() => this.completed.emit(email));
  }

  verifyEmailError(): string {
    return translateRegisterFieldError(
      this.translate,
      getEmailError(this.verifyEmail.controls.email)
    );
  }
}

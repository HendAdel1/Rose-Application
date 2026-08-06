import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LoadingService } from '@org/auth-data-access';
import { CustomInput } from '@org/sharedComponents';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, catchError } from 'rxjs';

import { CustomButton } from '../../../../shared/custom-button/custom-button';
import {
  getConfirmPasswordError,
  getCurrentPasswordError,
  getNewPasswordError,
} from '../../utils/form-field-errors';
import { passwordMatchValidator } from '../../utils/password-match.validator';
import { passwordStrengthValidator } from '../../utils/password-strength.validator';
import { ChangePasswordService } from '../../services/change-password.service';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, CustomInput, CustomButton, TranslatePipe],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {
  private readonly fb = inject(FormBuilder);
  private readonly changePasswordService = inject(ChangePasswordService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);

  readonly loading = inject(LoadingService);

  readonly form: FormGroup = this.fb.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator() },
  );

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword, confirmPassword } =
      this.form.getRawValue();

    this.changePasswordService
      .changePassword({ currentPassword, newPassword, confirmPassword })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => EMPTY),
      )
      .subscribe((response) => {
        this.toastr.success(
          response.message ||
            this.translate.instant('SETTINGS.CHANGE_PASSWORD.SUCCESS'),
          this.translate.instant('SETTINGS.CHANGE_PASSWORD.SUCCESS_TITLE'),
        );
        this.form.reset();
      });
  }

  currentPasswordError(): string {
    const key = getCurrentPasswordError(this.form.get('currentPassword'));
    return key ? this.translate.instant(key) : '';
  }

  newPasswordError(): string {
    const key = getNewPasswordError(this.form.get('newPassword'));
    return key ? this.translate.instant(key) : '';
  }

  confirmPasswordError(): string {
    const key = getConfirmPasswordError(
      this.form.get('confirmPassword'),
      this.form,
    );
    return key ? this.translate.instant(key) : '';
  }
}

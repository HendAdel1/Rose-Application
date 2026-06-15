import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthButton } from "../../shared/ui/auth-button/auth-button";

@Component({
  selector: 'app-reset-password-form',
  imports: [AuthButton, ReactiveFormsModule],
  templateUrl: './reset-password-form.html',
  styleUrl: './reset-password-form.css',
})
export class ResetPasswordForm {
 private fb = inject(FormBuilder);

  showPassword = false;
  isSubmitting = false;

  resetPasswordForm: FormGroup = this.fb.group({
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  onSubmit() {
    console.log();
  }
}

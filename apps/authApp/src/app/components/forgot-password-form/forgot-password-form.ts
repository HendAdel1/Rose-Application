import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthButton } from "../../shared/ui/auth-button/auth-button";

@Component({
  selector: 'app-forgot-password-form',
  imports: [ReactiveFormsModule, AuthButton],
  templateUrl: './forgot-password-form.html',
  styleUrl: './forgot-password-form.css',
})
export class ForgotPasswordForm {
  private fb = inject(FormBuilder);

  isSubmitting = false;

  forgotPasswordForm: FormGroup = this.fb.group({
    email: ['', Validators.required],
  });

  onSubmit() {
    console.log();
  }

}

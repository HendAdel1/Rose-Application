import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthButton } from "../shared/ui/auth-button/auth-button";

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, AuthButton],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private fb = inject(FormBuilder);

  showPassword = false;
  isSubmitting = false;
  loginForm: FormGroup = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  get password() {
    return this.loginForm.get('password');
  }

  get controls() {
    return this.loginForm.controls;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    console.log();
  }
}

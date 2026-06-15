import { Component } from '@angular/core';
import { AuthLink } from "../../shared/ui/auth-link/auth-link";
import { ForgotPasswordForm } from '../../components/forgot-password-form/forgot-password-form';

@Component({
  selector: 'app-forgot-password',
  imports: [ForgotPasswordForm, AuthLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {}

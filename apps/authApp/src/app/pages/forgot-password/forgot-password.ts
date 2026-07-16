import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthLink } from '../../shared/ui/auth-link/auth-link';
import { ForgotPasswordForm } from '../../components/forgot-password-form/forgot-password-form';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  imports: [ForgotPasswordForm, AuthLink, RouterLink, TranslatePipe],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {}

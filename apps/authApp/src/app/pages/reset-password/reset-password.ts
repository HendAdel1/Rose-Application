import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ResetPasswordForm } from '../../components/reset-password-form/reset-password-form';
import { AuthLink } from '../../shared/ui/auth-link/auth-link';

@Component({
  selector: 'app-reset-password',
  imports: [ResetPasswordForm, AuthLink, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {

}
import { Component } from '@angular/core';
import { ResetPasswordForm } from '../../components/reset-password-form/reset-password-form';
import { AuthLink } from "../../shared/ui/auth-link/auth-link";

@Component({
  selector: 'app-reset-password',
  imports: [ResetPasswordForm, AuthLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {

}

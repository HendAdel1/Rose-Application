import { Component } from '@angular/core';
import { LoginForm } from "../../components/login-form/login-form";
import { AuthLink } from "../../shared/ui/auth-link/auth-link";
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-login',
  imports: [LoginForm, AuthLink, RouterLink, TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}


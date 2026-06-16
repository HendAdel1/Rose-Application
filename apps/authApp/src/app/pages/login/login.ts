import { Component } from '@angular/core';
import { LoginForm } from "../../components/login-form";
import { AuthLink } from "../../shared/ui/auth-link/auth-link";
@Component({
  selector: 'app-login',
  imports: [LoginForm, AuthLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}


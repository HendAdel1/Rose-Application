import { Component } from '@angular/core';
import { LoginForm } from "../../components/login-form/login-form";
import { AuthLink } from "../../shared/ui/auth-link/auth-link";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [LoginForm, AuthLink,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}

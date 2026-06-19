import { Component } from '@angular/core';
import { AuthLink } from '../../shared/ui/auth-link/auth-link';
import { RegisterForm } from '../../components/register-form/register-form';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [AuthLink, RegisterForm, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {}

import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-button',
  imports: [NgClass],
  templateUrl: './auth-button.html',
  styleUrl: './auth-button.css',
})
export class AuthButton {
  @Input() disabled = false;
  @Input() loading = false;
  @Input() variant: 'primary' | 'secondary' = 'primary';
}

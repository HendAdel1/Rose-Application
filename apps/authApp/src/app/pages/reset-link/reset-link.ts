import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-link',
  imports: [RouterLink],
  templateUrl: './reset-link.html',
  styleUrl: './reset-link.css',
})
export class ResetLink implements OnInit {
  private router = inject(Router);

  userEmail = signal<string>('user@example.com');
  cooldownSeconds = signal<number>(0);

  isResendDisabled = computed(() => this.cooldownSeconds() > 0);
  resendLink() {
    if (this.isResendDisabled()) return;

    console.log('Sending a new reset link to:', this.userEmail());

    this.cooldownSeconds.set(60);
    const interval = setInterval(() => {
      this.cooldownSeconds.update(time => time - 1);
      if (this.cooldownSeconds() === 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  ngOnInit() {
    const navigation = this.router.currentNavigation();
    const stateEmail = navigation?.extras.state?.['email'];
    if (stateEmail) {
      this.userEmail.set(stateEmail);
    }
  }
}

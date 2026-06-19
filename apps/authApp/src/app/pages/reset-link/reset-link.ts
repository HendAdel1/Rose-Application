import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { LucideArrowLeft, LucideMailCheck } from '@lucide/angular';
import { Router, RouterLink } from '@angular/router';
import { UiButton } from '@org/sharedComponents';

@Component({
  selector: 'app-reset-link',
  imports: [RouterLink, UiButton, LucideArrowLeft, LucideMailCheck],
  templateUrl: './reset-link.html',
  styleUrl: './reset-link.css',
})
export class ResetLink implements OnInit {
  private readonly router = inject(Router);

  readonly userEmail = signal('user@example.com');
  readonly cooldownSeconds = signal(0);

  readonly isResendDisabled = computed(() => this.cooldownSeconds() > 0);

  resendLink(): void {
    if (this.isResendDisabled()) {
      return;
    }

    this.cooldownSeconds.set(60);
    const interval = setInterval(() => {
      this.cooldownSeconds.update((time) => time - 1);

      if (this.cooldownSeconds() === 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  ngOnInit(): void {
    const navigation = this.router.currentNavigation();
    const stateEmail = navigation?.extras.state?.['email'];

    if (stateEmail) {
      this.userEmail.set(stateEmail);
    }
  }
}

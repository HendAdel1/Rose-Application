import { Component, Input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { RegisterDetailsStep } from './steps/register-details-step/register-details-step';
import { RegisterEmailStep } from './steps/register-email-step/register-email-step';
import { RegisterOtpStep } from './steps/register-otp-step/register-otp-step';

@Component({
  selector: 'app-register-form',
  imports: [
    TranslatePipe,
    RegisterEmailStep,
    RegisterOtpStep,
    RegisterDetailsStep,
  ],
  templateUrl: './register-form.html',
})
export class RegisterForm {
  readonly step = signal(1);
  readonly verificationEmail = signal('');

  @Input() length = 6;
  @Input() cooldownTime = 60;
  @Input() expirationTime = 600;

  onEmailCompleted(email: string): void {
    this.verificationEmail.set(email);
    this.step.set(2);
  }

  onOtpCompleted(): void {
    this.step.set(3);
  }
}

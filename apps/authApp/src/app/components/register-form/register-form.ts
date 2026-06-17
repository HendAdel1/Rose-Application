import { Component, ElementRef, inject, Input, OnInit, QueryList, signal, ViewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import{CustomInput,UiButton,UiErrorMessage,UiLabel}from '@org/sharedComponents'
import { InputMaskModule } from 'primeng/inputmask';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import{AuthApiService} from '@org/auth-data-access'
import { Router, RouterLink } from '@angular/router';
import { LucideEye, LucideEyeOff } from '@lucide/angular';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule,CustomInput,UiLabel,UiButton,InputMaskModule,
    MessageModule, InputTextModule,UiErrorMessage,LucideEye,LucideEyeOff,RouterLink],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm implements OnInit{
step=signal<number>(1);
msgError=signal<string>('')
isLoading=signal<boolean>(false);
isError=signal<boolean>(false)
isSubmitting=signal<string>('')
private readonly authApiService=inject(AuthApiService)
private readonly router=inject(Router)
@Input() length = 6;
  @Input() cooldownTime = 60;
  @Input() onVerify!: (otp: string) => Promise<boolean>;
  @Input() onResend!: () => Promise<boolean>;

  @ViewChildren('otpInput') inputElements!: QueryList<ElementRef<HTMLInputElement>>;
  otpFormArray = new FormArray<FormControl>([]);
  timer = signal<number>(0);
  isResending = signal<boolean>(false);
  isCodeSend= signal<boolean>(false);
  feedbackMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);


verifyEmail:FormGroup=new FormGroup({
  email:new FormControl(null,[Validators.required,Validators.email])
})

confirmEmail:FormGroup=new FormGroup({
    email:new FormControl(null,[Validators.required,Validators.email]),
  code:new FormControl(null,[Validators.required])
})
registerForm:FormGroup=new FormGroup({
  username:new FormControl(null,[Validators.required,Validators.minLength(3),Validators.maxLength(20)]),
    email:new FormControl(null,[Validators.required,Validators.email]),
      password:new FormControl(null,[Validators.required,Validators.pattern(/^1[0125]\d{8}$/)]),
        confirmPassword:new FormControl(null,[Validators.required]),
  firstName:new FormControl(null,[Validators.required]),
  lastName:new FormControl(null,[Validators.required]),
  gender:new FormControl(null,[Validators.required]),
},{validators:this.passwordMatchValidator});
passwordMatchValidator(g: AbstractControl) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }




sendEmailVerification() {
  if (this.verifyEmail.valid) {


      this.step.set(2);
      this.feedbackMessage.set({
        type: 'success',
        text: 'You already have an active verification code. Please enter it below.'
      });
      return;


    this.isLoading.set(true);
    this.isError.set(false);

    this.authApiService.sendEmailVerification(this.verifyEmail.value).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.step.set(2);
          this.isCodeSend.set(true)
        this.timer.set(this.cooldownTime);
        this.startCooldownTimer();


      },
      error: (err) => {
        this.isLoading.set(false);
        this.isError.set(true);
        this.msgError.set(err?.error?.message || err?.message || 'Something went wrong');
      }
    });
  }
}

  confirmEmailVerification() {
    if (this.verifyEmail.valid) {
      this.isLoading.set(true);
      this.isError.set(false);

      this.authApiService.confirmEmailVerification(this.confirmEmail.value).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.step.set(3);
          console.log('Verification Success:', this.confirmEmail.value);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.isError.set(true);

          const errorText = err?.error?.message || err?.message || 'OtpCode is wrong';
          this.feedbackMessage.set({ type: 'error', text: errorText });
        }
      });
    }
  }

  private startCooldownTimer() {
    const intervalId = setInterval(() => {
      if (this.timer() <= 0) {
        clearInterval(intervalId);
      } else {
        this.timer.update(val => val - 1);
      }
    }, 1000);
  }

  onSubmit() {
    if (this.otpFormArray.invalid) {
      this.feedbackMessage.set({ type: 'error', text: 'Please fill out all verification boxes.' });
      return;
    }

    const fullOtp = this.otpFormArray.value.join('');
    this.feedbackMessage.set(null);

    this.confirmEmail.get('email')?.setValue(this.verifyEmail.get('email')?.value);
    this.confirmEmail.get('code')?.setValue(fullOtp);

    this.confirmEmailVerification();
  }

  handleResend() {
    if (this.timer() > 0 || this.isResending()) return;

    this.isResending.set(true);
    this.feedbackMessage.set(null);

    const emailValue = this.verifyEmail.get('email')?.value;

    this.authApiService.sendEmailVerification({ email: emailValue }).subscribe({
      next: (res) => {
        this.isResending.set(false);
        this.feedbackMessage.set({ type: 'success', text: 'A fresh security code has been dispatched!' });

        this.otpFormArray.reset();
        this.timer.set(this.cooldownTime);
        this.startCooldownTimer();

        setTimeout(() => this.inputElements.toArray()[0]?.nativeElement.focus(), 50);
      },
      error: (err) => {
        this.isResending.set(false);
        const errorText = err?.error?.message || err?.message || 'An issue occurred sending your code.';
        this.feedbackMessage.set({ type: 'error', text: errorText });
      }
    });
  }

  onInputChange(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '');

    if (value) {
      value = value.substring(value.length - 1);
      this.otpFormArray.at(index).setValue(value, { emitEvent: false });

      if (index < this.length - 1) {
        this.inputElements.toArray()[index + 1].nativeElement.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace') {
      const currentControl = this.otpFormArray.at(index);

      if (!currentControl.value && index > 0) {
        this.otpFormArray.at(index - 1).setValue('');
        this.inputElements.toArray()[index - 1].nativeElement.focus();
      } else {
        currentControl.setValue('');
      }
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text') || '';
    const cleanDigits = clipboardData.replace(/[^0-9]/g, '').substring(0, this.length);

    if (cleanDigits) {
      cleanDigits.split('').forEach((char, index) => {
        if (index < this.length) {
          this.otpFormArray.at(index).setValue(char);
        }
      });

      const targetIndex = Math.min(cleanDigits.length, this.length - 1);
      this.inputElements.toArray()[targetIndex]?.nativeElement.focus();
    }
  }
  register(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      console.log('Form Data:', this.registerForm.value);
     this.authApiService.register(this.registerForm.value).subscribe({
      next:(res)=>{
        if(res.message==='success'){
          setTimeout(() => {
this.router.navigate(['/auth/login'])
          }, 500);

          this.isSubmitting.set(res.message)
        }
this.isLoading.set(false);
      },
     error:(err)=>{
      this.isLoading.set(false)
      this.isSubmitting.set(err.message)
     }
     })
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
  ngOnInit() {
    this.otpFormArray.clear();
    for (let i = 0; i < this.length; i++) {
      this.otpFormArray.push(new FormControl('', [Validators.required, Validators.pattern('[0-9]')]));
    }
    this.timer.set(0);

  }
}


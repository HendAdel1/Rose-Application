import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import{CustomInput,UiButton,UiLabel}from '@org/sharedComponents'
import { InputMaskModule } from 'primeng/inputmask';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import{AuthApiService, AuthError} from '@org/auth-data-access'
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule,CustomInput,UiLabel,UiButton,InputMaskModule, MessageModule, InputTextModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm implements OnDestroy{
step=signal<number>(1);
msgError=signal<string>('')
isLoading=signal<boolean>(false);
isError=signal<boolean>(false)
private readonly authApiService=inject(AuthApiService)
private readonly router=inject(Router)
private emailVerificationSub?:Subscription;


verifyEmail:FormGroup=new FormGroup({
  email:new FormControl(null,[Validators.required,Validators.email])
})

confirmEmail:FormGroup=new FormGroup({
  email:new FormControl(null,[Validators.required,Validators.email]),
  code:new FormControl(null,[Validators.required, Validators.pattern(/^\d{6}$/)])
})



sendEmailVerification(){
this.msgError.set('');
if(this.verifyEmail.valid){
  const email = this.verifyEmail.get('email')?.value?.trim();

  if (!email) {
    this.verifyEmail.get('email')?.markAsTouched();
    return;
  }

  this.verifyEmail.patchValue({ email });
  this.isLoading.set(true)
this.emailVerificationSub= this.authApiService.sendEmailVerification({ email }).subscribe({
  next:(res)=>{
    this.isLoading.set(false)
    this.confirmEmail.patchValue({ email })
    this.step.set(2)
  },
  error:(error: AuthError)=>{
    this.isLoading.set(false)
    this.msgError.set(error.message)
  },

 })
}
}
confirmEmailVerification(){
 this.msgError.set('');
 if(this.confirmEmail.valid){
  const email = this.confirmEmail.get('email')?.value?.trim();
  const code = this.confirmEmail.get('code')?.value?.toString().trim();

  if (!email || !code) {
    this.confirmEmail.markAllAsTouched();
    return;
  }

  this.confirmEmail.patchValue({ email, code });
  this.isLoading.set(true)
 this.emailVerificationSub =this.authApiService.confirmEmailVerification({ email, code }).subscribe({
  next:(res)=>{
    this.isLoading.set(false)
    this.step.set(2);
    // console.log(res);

  },
  error:(error: AuthError)=>{
    this.isLoading.set(false)
    this.msgError.set(error.message)
  }
 })
}
}
ngOnDestroy(): void {
  if(this.emailVerificationSub){
    this.emailVerificationSub.unsubscribe();
  }
}
}


import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import{CustomInput,UiButton,UiErrorMessage,UiLabel}from '@org/sharedComponents'
import { InputMaskModule } from 'primeng/inputmask';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import{AuthApiService} from '@org/auth-data-access'
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule,CustomInput,UiLabel,UiButton,InputMaskModule, MessageModule, InputTextModule,UiErrorMessage],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
step=signal<number>(1);
msgError=signal<string>('')
isLoading=signal<boolean>(false);
isError=signal<boolean>(false)
private readonly authApiService=inject(AuthApiService)
private readonly router=inject(Router)


verifyEmail:FormGroup=new FormGroup({
  email:new FormControl(null,[Validators.required,Validators.email])
})

confirmEmail:FormGroup=new FormGroup({
  email:new FormControl(null,[Validators.required,Validators.email]),
  code:new FormControl(null,[Validators.required])
})



sendEmailVerification(){
if(this.verifyEmail.valid){
  this.isLoading.set(true)
 this.authApiService.sendEmailVerification(this.verifyEmail.value).subscribe({
  next:(res)=>{
    this.isLoading.set(false)
    this.step.set(2)
    console.log(this.step());

  },
  error:(err)=>{
    this.isLoading.set(false)
    this.isError.set(true)
    this.msgError=err.error.message;
  }
 })
}
}
confirmEmailVerification(){
 if(this.verifyEmail.valid){
  this.isLoading.set(true)
 this.authApiService.confirmEmailVerification(this.confirmEmail.value).subscribe({
  next:(res)=>{
    this.isLoading.set(false)
    this.step.set(2);
    // console.log(res);

  },
  error:(err)=>{
    this.isLoading.set(false)
    this.isError.set(true)
    this.msgError=err.error.message;
  }
 })
}

}
}


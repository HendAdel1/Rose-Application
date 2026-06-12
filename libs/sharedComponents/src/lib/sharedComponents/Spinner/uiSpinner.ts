import { CommonModule } from '@angular/common';
import { Component, inject, input,effect } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'lib-ui-spinner',
  imports: [CommonModule,NgxSpinnerModule],
  templateUrl: './uiSpinner.html',
  styleUrl: './uiSpinner.css',
})
export class UiSpinner {
  private readonly ngxSpinnerService=inject(NgxSpinnerService);
  show = input.required<boolean>();
  bdColor = input<string>('rgba(0, 0, 0, 0.7)');
  size = input<'small' | 'medium' | 'large'>('medium');
  color = input<string>('#B23B29');
  type = input<string>('ball-clip-rotate-multiple');
  fullScreen = input<boolean>(true);
  loadingText = input<string | null>(null);
constructor() {
  effect(()=>{
    if(this.show()){
      this.ngxSpinnerService.show()
    }
    else{
      this.ngxSpinnerService.hide();
    }
  });
}
}

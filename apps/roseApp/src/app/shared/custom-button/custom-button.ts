import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-custom-button',
  imports: [CommonModule,ButtonModule],
  templateUrl: './custom-button.html',
  styleUrl: './custom-button.css',
})
export class CustomButton {
  label =input<string>('')
  icon=input<string>('')
  iconPos=input<'left'|'right'>('left')
  variant=input<'primary'|'icon-only'>('icon-only')
  disabled=input<boolean>(false)
  fullWidth=input<boolean>(false)

  btnClick=output<void>()

  getButtonStyles(): string{
    if(this.variant() === 'icon-only'){
      return 'w-10 h-10 flex items-center justify-center bg-white text-zinc-100 shadow-sm border border-gray-100 rounded-full hover:bg-gray-50 active:scale-95 transition-transform p-0';
    }
    const primary='bg-maroon-600 border-none text-white text-sm rounded-xl font-medium py-3 px-6 shadow-sm hover:bg-maroon-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2';
    return this.fullWidth() ? `${primary} w-full`: primary;
  }
}

import { Component, forwardRef, input, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'lib-custom-input',
  imports: [ ],
  providers:[     {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInput),
      multi: true
    }],
  templateUrl: './custom-input.html',
  styleUrl: './custom-input.css',
})
export class CustomInput implements ControlValueAccessor {
  type = input<'text'|'password'|'email'|'number'>('text')
  label =input<string>('');
  placeholder =input<string>('');
  helperText =input<string>('');
  errorMessage =input<string>('');
  readonly =input<boolean>();
  valueChange = output<string>();
  value:string|number|null= null;
  disabled= false;
  isInvlaid = input<boolean>(false)
   onChange: (value:string|number|null) => void = () => {/**/ }
  onTouched: (value:string|number|null) => void = () => {/**/}


  writeValue(value:string|number|null): void {
  this.value=value;
  }
  registerOnChange(fn: (value:string|number|null)=>void): void {
    this.onChange=fn;
  }
  registerOnTouched(fn: (value:string|number|null)=>void): void {
    this.onTouched=fn;
  }
    setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
  onInputChange(event:Event):void{
    const target= event.target as HTMLInputElement;
    this.value=target.value
    this.onChange(this.value)
  }

}

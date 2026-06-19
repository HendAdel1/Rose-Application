import { Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  LucideChevronDown,
  LucideDynamicIcon,
  LucideEye,
  LucideEyeOff,
  LucideSearch,
  provideLucideIcons,
} from '@lucide/angular';

export type CustomInputType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'search'
  | 'tel';

export interface CustomInputOption {
  value: string;
  label: string;
}

@Component({
  selector: 'lib-custom-input',
  imports: [LucideDynamicIcon],
  providers: [
    provideLucideIcons(
      LucideSearch,
      LucideEye,
      LucideEyeOff,
      LucideChevronDown
    ),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInput),
      multi: true,
    },
  ],
  templateUrl: './custom-input.html',
  styleUrl: './custom-input.css',
})
export class CustomInput implements ControlValueAccessor {
  type = input<CustomInputType>('text');
  id = input<string>('');
  label = input<string>('');
  placeholder = input<string>('');
  helperText = input<string>('');
  errorMessage = input<string>('');
  readonly = input<boolean>(false);
  isInvalid = input<boolean>(false);
  options = input<readonly CustomInputOption[]>([]);
  valueChange = output<string>();

  value: string | number | null = null;
  disabled = false;

  readonly showPassword = signal(false);

  readonly isSelect = computed(() => this.options().length > 0);

  readonly hasLeadingIcon = computed(() => this.type() === 'search');

  readonly hasTrailingIcon = computed(
    () => this.isSelect() || this.type() === 'password'
  );

  readonly resolvedType = computed(() => {
    if (this.type() === 'password') {
      return this.showPassword() ? 'text' : 'password';
    }

    return this.type();
  });

  readonly controlClasses = computed(() => {
    const base =
      'box-border w-full rounded-[10px] border p-4 transition-colors focus:outline-none ' +
      'bg-white text-zinc-800 placeholder:text-zinc-400 border border-zinc-300 hover:border-zinc-400 focus:border-maroon-600' +
      'dark:bg-zinc-700 dark:text-zinc-50 dark:border-zinc-600 dark:hover:border-zinc-500 dark:focus:border-soft-pink-400' +
      'disabled:cursor-not-allowed disabled:opacity-60';

    const state = this.isInvalid()
      ? ' border-red-600 hover:border-red-600 focus:border-red-600 dark:border-red-500 hover:border-red-500 focus:border-red-500'
      : ' border-zinc-300 hover:border-zinc-400 focus:border-maroon-600 ' +
        'dark:border-zinc-600 dark:hover:border-zinc-500 dark:focus:border-soft-pink-400';

    const leading = this.hasLeadingIcon() ? ' pl-11' : '';
    const trailing = this.hasTrailingIcon() ? ' pr-11' : '';
    const select = this.isSelect() ? ' cursor-pointer appearance-none' : '';

    return base + state + leading + trailing + select;
  });

  private onChange: (value: string | number | null) => void = () => {
    /**/
  };
  private onTouched: () => void = () => {
    /**/
  };

  writeValue(value: string | number | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  togglePassword(): void {
    this.showPassword.update((shown) => !shown);
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(target.value);
  }

  onInputBlur(): void {
    this.onTouched();
  }
}

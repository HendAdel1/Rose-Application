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

import { UiLabel } from '../ui-label/ui-label';
import {
  COUNTRY_CODES,
  CountryCode,
  DEFAULT_COUNTRY_ISO,
  findCountryByDialCode,
  findCountryByIso,
} from './country-codes';

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
  imports: [LucideDynamicIcon, UiLabel],
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
  inputClass = input<string>('');
  readonly = input<boolean>(false);
  isInvalid = input<boolean>(false);
  options = input<readonly CustomInputOption[]>([]);
  showCountryCode = input<boolean>(false);
  defaultCountryIso = input<string>(DEFAULT_COUNTRY_ISO);
  valueChange = output<string>();
  countryChange = output<CountryCode>();

  value: string | number | null = null;
  disabled = false;

  readonly showPassword = signal(false);
  readonly countryListOpen = signal(false);
  readonly countries = COUNTRY_CODES;
  readonly selectedCountry = signal<CountryCode>(
    findCountryByIso(this.defaultCountryIso()) ?? this.countries[0],
  );
  readonly phoneDigits = signal('');

  readonly isSelect = computed(() => this.options().length > 0);

  readonly isPhoneWithCountryCode = computed(
    () => this.type() === 'tel' && this.showCountryCode(),
  );

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
      'box-border w-full rounded-[10px] border px-4 py-3 focus:outline-none font-inter ' +
      'bg-white text-zinc-800 placeholder:text-zinc-400 border-zinc-300 hover:border-zinc-400 focus:border-maroon-600 ' +
      'dark:bg-zinc-700 dark:text-zinc-50 dark:border-zinc-600 dark:hover:border-zinc-500 dark:focus:border-soft-pink-400 ' +
      'disabled:cursor-not-allowed disabled:opacity-60';

    const state = this.isInvalid()
      ? ' border-red-600 hover:border-red-600 focus:border-red-600 dark:border-red-500 dark:hover:border-red-500 dark:focus:border-red-500'
      : ' border-zinc-300 hover:border-zinc-400 focus:border-maroon-600 ' +
        'dark:border-zinc-600 dark:hover:border-zinc-500 dark:focus:border-soft-pink-400';

    const leading = this.hasLeadingIcon() ? ' pl-11' : '';
    const trailing = this.hasTrailingIcon() ? ' pr-11' : '';
    const select = this.isSelect() ? ' cursor-pointer appearance-none' : '';

    return base + state + leading + trailing + select + this.inputClass();
  });

  readonly phoneWrapperClasses = computed(() => {
    const base =
      'box-border flex w-full items-center rounded-[10px] border font-inter ' +
      'bg-white border-zinc-300 hover:border-zinc-400 focus-within:border-maroon-600 ' +
      'dark:bg-zinc-700 dark:border-zinc-600 dark:hover:border-zinc-500 dark:focus-within:border-soft-pink-400 ' +
      'has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60';

    const state = this.isInvalid()
      ? ' border-red-600 hover:border-red-600 focus-within:border-red-600 dark:border-red-500 dark:hover:border-red-500 dark:focus-within:border-red-500'
      : '';

    return base + state + this.inputClass();
  });

  readonly phoneInputClasses =
    'min-w-0 flex-1 bg-transparent px-3 py-3 text-zinc-800 placeholder:text-zinc-400 ' +
    'focus:outline-none dark:text-zinc-50 disabled:cursor-not-allowed disabled:opacity-60';

  readonly countryButtonClasses =
    'flex shrink-0 cursor-pointer items-center gap-1.5 rounded-s-[10px] py-3 ps-4 pe-3 text-sm font-medium ' +
    'text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none dark:text-zinc-100 dark:hover:bg-zinc-600/60';

  private onChange: (value: string | number | null) => void = () => {
    /**/
  };
  private onTouched: () => void = () => {
    /**/
  };

  writeValue(value: string | number | null): void {
    this.value = value;

    if (!this.isPhoneWithCountryCode()) {
      return;
    }

    const rawValue = value == null ? '' : String(value);

    if (!rawValue) {
      this.phoneDigits.set('');
      return;
    }

    const matchedCountry = findCountryByDialCode(rawValue);

    if (matchedCountry) {
      this.selectedCountry.set(matchedCountry);
      this.phoneDigits.set(rawValue.slice(matchedCountry.dialCode.length));
    } else {
      this.phoneDigits.set(rawValue);
    }
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

  toggleCountryList(): void {
    this.countryListOpen.update((open) => !open);
  }

  closeCountryList(): void {
    this.countryListOpen.set(false);
  }

  selectCountry(country: CountryCode): void {
    this.selectedCountry.set(country);
    this.countryListOpen.set(false);
    this.countryChange.emit(country);
    this.emitPhoneValue();
    this.onTouched();
  }

  onPhoneDigitsChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.phoneDigits.set(target.value);
    this.emitPhoneValue();
  }

  private emitPhoneValue(): void {
    const fullValue = `${this.selectedCountry().dialCode}${this.phoneDigits()}`;
    this.value = fullValue;
    this.onChange(fullValue);
    this.valueChange.emit(fullValue);
  }
}

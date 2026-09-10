import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LucideImage, LucideUpload, LucideX } from '@lucide/angular';
import { Subscription } from 'rxjs';

import { CustomInput } from '../reusable-input/custom-input';
import { UiButton } from '../ui-button/ui-button';
import { UiLabel } from '../ui-label/ui-label';
import {
  DynamicFieldConfig,
  DynamicFormConfig,
  DynamicFormSubmitEvent,
  DynamicFormValue,
} from './models/dynamic-form.model';

@Component({
  selector: 'lib-dynamic-form',
  imports: [
    ReactiveFormsModule,
    CustomInput,
    UiButton,
    UiLabel,
    LucideImage,
    LucideUpload,
    LucideX,
  ],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicForm implements OnChanges, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private formSubs = new Subscription();

  readonly config = input.required<DynamicFormConfig>();
  readonly initialValue = input<DynamicFormValue>({});
  readonly loading = input(false);
  readonly submitDisabled = input(false);

  readonly formSubmit = output<DynamicFormSubmitEvent>();
  readonly formCancel = output<void>();
  readonly statusChange = output<'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'>();
  readonly valueChange = output<DynamicFormValue>();

  readonly form = signal<FormGroup>(this.fb.group({}));
  readonly filePreviews = signal<Record<string, string>>({});
  readonly fileNames = signal<Record<string, string>>({});
  readonly submitted = signal(false);

  readonly fields = computed(() => this.config().fields);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] || changes['initialValue']) {
      this.buildForm();
    }
  }

  ngOnDestroy(): void {
    this.formSubs.unsubscribe();
    Object.keys(this.filePreviews()).forEach((key) => this.revokePreview(key));
  }

  control(key: string): FormControl {
    return this.form().get(key) as FormControl;
  }

  isInvalid(key: string): boolean {
    const ctrl = this.form().get(key);
    if (!ctrl) {
      return false;
    }
    return ctrl.invalid && (ctrl.touched || ctrl.dirty || this.submitted());
  }

  isRequired(field: DynamicFieldConfig): boolean {
    return !!field.validators?.required;
  }

  errorMessage(field: DynamicFieldConfig): string {
    const ctrl = this.form().get(field.key);
    if (!ctrl?.errors) {
      return '';
    }

    const errors = ctrl.errors;
    const v = field.validators;

    if (errors['required']) {
      return typeof v?.required === 'string' ? v.required : `${field.label} is required`;
    }
    if (errors['minlength']) {
      return `${field.label} must be at least ${errors['minlength'].requiredLength} characters`;
    }
    if (errors['maxlength']) {
      return `${field.label} must be at most ${errors['maxlength'].requiredLength} characters`;
    }
    if (errors['min']) {
      return `${field.label} must be at least ${errors['min'].min}`;
    }
    if (errors['max']) {
      return `${field.label} must be at most ${errors['max'].max}`;
    }
    if (errors['pattern']) {
      return v?.patternMessage ?? `${field.label} format is invalid`;
    }
    if (errors['fileType']) {
      return `Invalid file type. Allowed: ${v?.accept ?? 'images'}`;
    }
    if (errors['fileSize']) {
      return `File must be under ${v?.maxSizeMb ?? 5}MB`;
    }

    const firstKey = Object.keys(errors)[0];
    const first = errors[firstKey];
    if (typeof first === 'string') {
      return first;
    }
    if (first && typeof first === 'object' && 'message' in first) {
      return String((first as { message: string }).message);
    }
    return `${field.label} is invalid`;
  }

  onFileSelected(field: DynamicFieldConfig, event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const file = inputEl.files?.[0] ?? null;
    inputEl.value = '';

    const ctrl = this.control(field.key);
    ctrl.setValue(file);
    ctrl.markAsDirty();
    ctrl.markAsTouched();
    ctrl.updateValueAndValidity();

    this.revokePreview(field.key);

    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      this.filePreviews.update((map) => ({ ...map, [field.key]: url }));
      this.fileNames.update((map) => ({ ...map, [field.key]: file.name }));
      return;
    }

    this.filePreviews.update((map) => {
      const next = { ...map };
      delete next[field.key];
      return next;
    });
    this.fileNames.update((map) => {
      const next = { ...map };
      if (file) {
        next[field.key] = file.name;
      } else {
        delete next[field.key];
      }
      return next;
    });
  }

  clearFile(field: DynamicFieldConfig): void {
    this.revokePreview(field.key);
    this.control(field.key).setValue(null);
    this.control(field.key).markAsDirty();
    this.filePreviews.update((map) => {
      const next = { ...map };
      delete next[field.key];
      return next;
    });
    this.fileNames.update((map) => {
      const next = { ...map };
      delete next[field.key];
      return next;
    });
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.form().markAllAsTouched();

    this.formSubmit.emit({
      value: this.form().getRawValue() as DynamicFormValue,
      valid: this.form().valid,
    });
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  private buildForm(): void {
    this.formSubs.unsubscribe();
    this.formSubs = new Subscription();

    Object.keys(this.filePreviews()).forEach((key) => this.revokePreview(key));
    this.filePreviews.set({});
    this.fileNames.set({});
    this.submitted.set(false);

    const group: Record<string, FormControl> = {};
    const initial = this.initialValue();

    for (const field of this.config().fields) {
      let value: unknown = initial[field.key] ?? null;

      if (field.type === 'file') {
        value = null;
      } else if (value === null || value === undefined) {
        value = field.type === 'number' ? null : '';
      }

      group[field.key] = this.fb.control(
        { value, disabled: !!field.disabled },
        { validators: this.buildValidators(field) },
      );
    }

    const form = this.fb.group(group);
    this.form.set(form);

    this.formSubs.add(
      form.statusChanges.subscribe((status) => {
        this.statusChange.emit(status as 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED');
      }),
    );

    this.formSubs.add(
      form.valueChanges.subscribe((value) => {
        this.valueChange.emit(value as DynamicFormValue);
      }),
    );

    this.statusChange.emit(form.status as 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED');
  }

  private buildValidators(field: DynamicFieldConfig) {
    const v = field.validators;
    const list = [];

    // File required is handled by fileValidator so existingFileUrl can satisfy it.
    if (v?.required && field.type !== 'file') {
      list.push(Validators.required);
    }
    if (v?.minLength != null) {
      list.push(Validators.minLength(v.minLength));
    }
    if (v?.maxLength != null) {
      list.push(Validators.maxLength(v.maxLength));
    }
    if (v?.min != null) {
      list.push(Validators.min(v.min));
    }
    if (v?.max != null) {
      list.push(Validators.max(v.max));
    }
    if (v?.pattern) {
      list.push(Validators.pattern(v.pattern));
    }
    if (field.type === 'file') {
      list.push(this.fileValidator(field));
    }
    if (v?.custom) {
      const customs = Array.isArray(v.custom) ? v.custom : [v.custom];
      list.push(...customs);
    }

    return list;
  }

  private fileValidator(field: DynamicFieldConfig) {
    return (control: AbstractControl) => {
      const file = control.value as File | null;
      const v = field.validators;
      const hasExisting = !!field.existingFileUrl;

      if (!file) {
        if (v?.required && !hasExisting) {
          return { required: true };
        }
        return null;
      }

      if (v?.accept) {
        const allowed = v.accept.split(',').map((part) => part.trim().toLowerCase());
        const typeOk = allowed.some((rule) => {
          if (rule.startsWith('.')) {
            return file.name.toLowerCase().endsWith(rule);
          }
          if (rule.endsWith('/*')) {
            return file.type.startsWith(rule.replace('/*', '/'));
          }
          return file.type === rule;
        });
        if (!typeOk) {
          return { fileType: true };
        }
      }

      if (v?.maxSizeMb != null && file.size > v.maxSizeMb * 1024 * 1024) {
        return { fileSize: true };
      }

      return null;
    };
  }

  private revokePreview(key: string): void {
    const url = this.filePreviews()[key];
    if (url?.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }
}

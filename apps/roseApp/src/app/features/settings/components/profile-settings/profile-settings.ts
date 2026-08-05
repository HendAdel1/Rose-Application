import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LucideCloudUpload, LucideTrash2, LucideX } from '@lucide/angular';
import { CustomInput } from '@org/sharedComponents';


import { CustomButton } from '../../../../shared/custom-button/custom-button';
import { TranslatePipe } from '@ngx-translate/core';

interface ProfileFormValue {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | '';
}

@Component({
  selector: 'app-profile-settings',
  imports: [
    ReactiveFormsModule,
    CustomInput,
    CustomButton,
    LucideCloudUpload,
    LucideTrash2,
    LucideX,
    TranslatePipe,

  ],
  templateUrl: './profile-settings.html',
  styleUrl: './profile-settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettings implements OnInit {
  readonly avatarUrl = signal<string | null>('');
  readonly photoError = signal<string | null>(null);
  readonly isDeleteDialogOpen = signal(false);
  readonly isDeleting = signal(false);

  readonly profileForm = new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', {
      nonNullable: true,
    }),
    gender: new FormControl<'male' | 'female' | ''>('', {
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.profileForm.patchValue({
      firstName: 'Jonathan',
      lastName: 'Adrian',
      email: 'jonathan@gmail.com',
      phone: '1012345678',
      gender: 'male',
    });

    this.profileForm.controls.gender.disable();
  }

  getInitial(): string {
    const firstName = this.profileForm.value.firstName || '';
    return firstName.charAt(0).toUpperCase();
  }

  firstNameError(): string {
    const control = this.profileForm.controls.firstName;
    if (!control.touched || !control.errors) return '';
    if (control.errors['required']) return 'First name is required';
    return '';
  }

  lastNameError(): string {
    const control = this.profileForm.controls.lastName;
    if (!control.touched || !control.errors) return '';
    if (control.errors['required']) return 'Last name is required';
    return '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.photoError.set(null);

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.photoError.set('File size exceeds 5MB limit');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  onSave(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const value = this.profileForm.getRawValue() as ProfileFormValue;
    console.log('Profile save:', value);
  }

  openDeleteDialog(): void {
    this.isDeleteDialogOpen.set(true);
  }

  closeDeleteDialog(): void {
    if (this.isDeleting()) return;
    this.isDeleteDialogOpen.set(false);
  }

  deleteAccount(): void {
    this.isDeleting.set(true);
    // Simulate API call
    setTimeout(() => {
      this.isDeleting.set(false);
      this.closeDeleteDialog();
      console.log('Account deleted');
    }, 1000);
  }
}

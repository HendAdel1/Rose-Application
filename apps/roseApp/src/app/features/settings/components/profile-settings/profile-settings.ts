import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  inject,
  DestroyRef,
} from '@angular/core';
import { Router } from '@angular/router';
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
import {
  ProfileService,
  UserProfile,
  UpdateProfileRequest,
  EmailChangeRequest,
  EmailConfirmRequest,
} from '../../services/profile.service';
import { AuthSessionService } from '@org/auth-data-access';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Skeleton } from 'primeng/skeleton';

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
    Skeleton,
  ],
  templateUrl: './profile-settings.html',
  styleUrl: './profile-settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettings implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly authSession = inject(AuthSessionService);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly avatarUrl = signal<string | null>('');
  readonly photoError = signal<string | null>(null);
  readonly isDeleteDialogOpen = signal(false);
  readonly isDeleting = signal(false);
  readonly isLoading = signal(false);
  readonly isEmailChangeSuccessful = signal(false);
  private readonly originalEmail = signal('');
  public readonly uploadedPhotoUrl = signal<string | null>(null);

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
    emailVerificationCode: new FormControl('', {
      nonNullable: true,
    }),
    phone: new FormControl('', {
      nonNullable: true,
    }),
    gender: new FormControl<'male' | 'female' | ''>('', {
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.profileForm.controls.gender.disable();
    this.loadProfile();
  }

  private loadProfile(): void {
    this.isLoading.set(true);
    this.profileService
      .getProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          if (res.status && res.payload?.user) {
            this.updateForm(res.payload.user);
          }
        },
        error: () => {
          this.isLoading.set(false);
          this.toastr.error('Failed to load profile data');

          // Fallback to auth session user if API fails
          const user = this.authSession.currentUser();
          if (user) {
            this.updateForm(user as any);
          }
        },
      });
  }

  private updateForm(user: UserProfile): void {
    this.profileForm.patchValue({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      gender: (user.gender?.toLowerCase() as any) || '',
    });

    this.originalEmail.set(user.email || '');

    if (user.photo) {
      this.avatarUrl.set(user.photo);
    }
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

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    this.profileService
      .uploadImage(file)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.status && res.payload?.url) {
            this.uploadedPhotoUrl.set(res.payload.url);
            this.toastr.success('Photo uploaded successfully');
          } else {
            this.photoError.set('Failed to upload photo');
          }
        },
        error: () => {
          this.photoError.set('Failed to upload photo');
        },
      });
  }

  onSave(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const value = this.profileForm.getRawValue();

    // If verification code is visible and filled, confirm the email change
    if (this.isEmailChangeSuccessful() && value.emailVerificationCode) {
      this.confirmEmailChange(value.emailVerificationCode);
    }

    const emailChanged = value.email !== this.originalEmail();

    if (emailChanged && !this.isEmailChangeSuccessful()) {
      this.requestEmailChange(value.email);
    }

    this.updateProfile(value);
  }

  private requestEmailChange(newEmail: string): void {
    const emailData: EmailChangeRequest = { newEmail };

    this.profileService
      .requestEmailChange(emailData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this.isEmailChangeSuccessful.set(true);
            this.toastr.success(res.message);
          } else {
            this.toastr.error('Failed to send verification code');
          }
        },
        error: () => {
          this.toastr.error('Failed to send verification code');
        },
      });
  }

  private confirmEmailChange(code: string): void {
    const confirmData: EmailConfirmRequest = { code };

    this.profileService
      .confirmEmailChange(confirmData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.status && res.payload?.user) {
            this.isEmailChangeSuccessful.set(false);
            this.originalEmail.set(res.payload.user.email);
            this.profileForm.controls.emailVerificationCode.reset();
            this.toastr.success('Email updated successfully');

            // Update auth session with new user data
            const currentToken = this.authSession.token();
            if (currentToken) {
              this.authSession.setSession({
                user: res.payload.user as any,
                token: currentToken,
              });
            }
          } else {
            this.toastr.error('Failed to confirm email change');
          }
        },
        error: () => {
          this.toastr.error('Failed to confirm email change');
        },
      });
  }

  private updateProfile(value: typeof this.profileForm.value): void {
    this.isLoading.set(true);
    let formattedPhone = value.phone?.trim();
    if (formattedPhone) {
      if (formattedPhone.startsWith('+')) {
        // Already has a country code (e.g. +20, +44), keep it as is
      } else if (formattedPhone.startsWith('00')) {
        // International prefix 00, convert to +
        formattedPhone = '+' + formattedPhone.substring(2);
      } else if (formattedPhone.startsWith('0')) {
        // Local Egyptian number (e.g. 010...), prepend +2 to make it +2010...
        formattedPhone = '+2' + formattedPhone;
      } else if (formattedPhone.startsWith('20')) {
        // Missing the +, just prepend it
        formattedPhone = '+' + formattedPhone;
      } else {
        // No prefix, default to Egypt country code
        formattedPhone = '+20' + formattedPhone;
      }
    }

    const updateData: UpdateProfileRequest = {
      firstName: value.firstName,
      lastName: value.lastName,
      phone: formattedPhone,
    };

    const uploadedPhoto = this.uploadedPhotoUrl();
    if (uploadedPhoto) {
      updateData.photo = uploadedPhoto;
    }

    this.profileService
      .updateProfile(updateData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          if (res.status) {
            this.uploadedPhotoUrl.set(null);
            this.profileForm.markAsPristine();
            this.toastr.success('Profile updated successfully');

            // Update the auth session with new user data
            const currentToken = this.authSession.token();
            if (currentToken) {
              this.authSession.setSession({
                user: res.payload.user as any,
                token: currentToken,
              });
            }
          } else {
            this.toastr.error('Failed to update profile');
          }
        },
        error: () => {
          this.isLoading.set(false);
          this.toastr.error('Failed to update profile');
        },
      });
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

    this.profileService
      .deleteAccount()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.isDeleting.set(false);
          this.closeDeleteDialog();

          if (res.status !== false) {
            this.toastr.success('Account deleted successfully');
            this.authSession.logout();
            void this.router.navigate(['/authApp/login']);
          } else {
            this.toastr.error('Failed to delete account');
          }
        },
        error: (err) => {
          this.isDeleting.set(false);
          this.closeDeleteDialog();
          // Detailed error message is likely handled by auth-error interceptor already
          // But we can show a specific one if needed
          if (err?.status === 403) {
            this.toastr.error(
              'Super admin accounts cannot be deleted',
              'Forbidden',
            );
          }
        },
      });
  }
}

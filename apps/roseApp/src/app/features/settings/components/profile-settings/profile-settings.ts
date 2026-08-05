import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  inject,
  DestroyRef,
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
import { ProfileService, UserProfile, UpdateProfileRequest } from '../../services/profile.service';
import { AuthSessionService } from '@org/auth-data-access';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private readonly profileService = inject(ProfileService);
  private readonly authSession = inject(AuthSessionService);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly avatarUrl = signal<string | null>('');
  readonly photoError = signal<string | null>(null);
  readonly isDeleteDialogOpen = signal(false);
  readonly isDeleting = signal(false);
  readonly isLoading = signal(false);

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
    this.profileForm.controls.gender.disable();
    this.loadProfile();
  }

  private loadProfile(): void {
    this.isLoading.set(true);
    this.profileService.getProfile()
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
        }
      });
  }

  private updateForm(user: UserProfile): void {
    this.profileForm.patchValue({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      gender: user.gender?.toLowerCase() as any || '',
    });

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

    const value = this.profileForm.getRawValue();
    const updateData: UpdateProfileRequest = {
      firstName: value.firstName,
      lastName: value.lastName,
      phone: value.phone,
      gender: value.gender?.toUpperCase(),
    };

    this.profileService.updateProfile(updateData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this.toastr.success('Profile updated successfully');
            
            // Update the auth session with new user data
            const currentToken = this.authSession.token();
            if (currentToken) {
               this.authSession.setSession({
                 user: res.payload.user as any,
                 token: currentToken
               });
            }
          } else {
             this.toastr.error('Failed to update profile');
          }
        },
        error: () => {
          this.toastr.error('Failed to update profile');
        }
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
    // Simulate API call
    setTimeout(() => {
      this.isDeleting.set(false);
      this.closeDeleteDialog();
      console.log('Account deleted');
    }, 1000);
  }
}


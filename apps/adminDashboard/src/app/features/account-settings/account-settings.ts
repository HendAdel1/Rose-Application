import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthSessionService } from '@org/auth-data-access';
import { DynamicForm,ConfirmDialog, DynamicFormConfig, DynamicFormSubmitEvent, EmailChangeRequest, EmailChangeResponse, EmailConfirmRequest, ProfileResponse, UpdateProfileRequest, UserProfile, ChangePasswordService } from '@org/shared-components';
import { ToastrService } from 'ngx-toastr';
import {ProfileService} from '@org/shared-components';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { accountFormConfig, passwordFormConfig } from './config/account-setttings.config';



@Component({
  selector: 'app-account-settings',
  imports: [DynamicForm,ConfirmDialog,TranslatePipe],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSettings {
    private readonly profileService = inject(ProfileService);
    private readonly changePasswordService = inject(ChangePasswordService);
  private readonly authSession = inject(AuthSessionService);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
   readonly isDeleteDialogOpen = signal(false);
  readonly isDeleting = signal(false);

  readonly avatarUrl = signal<string | null>('');
  readonly photoError = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly isEmailChangeSuccessful = signal(false);
  private readonly originalEmail = signal('');
  public readonly uploadedPhotoUrl = signal<string | null>(null);
readonly currentView = signal<'settings' | 'password'>('settings');

   readonly initialValues =signal<Record<string, unknown>>({
    avatar: this.avatarUrl(),
    firstName: 'Jonathan',
    lastName: 'Adrian',
    email: 'jonathan@gmail.com',
    phone: '1012345678',
    gender: 'male'
  });

  readonly accountConfig: DynamicFormConfig = accountFormConfig;

  readonly passwordConfig: DynamicFormConfig = passwordFormConfig;
  translate: any;
  form: any;


  // onSaveAccount(event: DynamicFormSubmitEvent): void {
  //   if (event.valid) {
  //     console.log('Account saved:', event.value);
  //   }
  // }

  // onSavePassword(event: DynamicFormSubmitEvent): void {
  //   if (event.valid) {
  //     console.log('Password updated:', event.value);
  //     this.currentView.set('settings');
  //   }
  // }
  ngOnInit(): void {
    this.loadProfile();
  }

  /**
   * Load profile from API
   */
  private loadProfile(): void {
    this.isLoading.set(true);

    this.profileService
      .getProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res:ProfileResponse) => {
          this.isLoading.set(false);

          if (res.status && res.payload?.user) {
            this.updateInitialValues(res.payload.user);
          }
        },


      });
  }

  /**
   * Convert API UserProfile → DynamicForm initialValue
   */
  private updateInitialValues(user: UserProfile): void {
    const email = user.email || '';

    this.initialValues.set({
      avatar: null,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email,
      phone: user.phone || '',
      gender: user.gender?.toLowerCase() || '',
    });

    this.originalEmail.set(email);

    /**
     * Keep the existing avatar in the DynamicForm.
     */
    if (user.photo) {
      this.accountConfig.fields[0].existingFileUrl = user.photo;
      this.accountConfig.fields[0].existingFileLabel = 'Current photo';
    }
  }

  /**
   * DynamicForm submit
   */
  onSaveAccount(event: DynamicFormSubmitEvent): void {
    if (!event.valid) {
      return;
    }

    const value = event.value;

    const email = String(value['email'] ?? '').trim();

    const emailChanged = email !== this.originalEmail();

    /**
     * If email changed, request verification first.
     *
     * Do NOT update the profile yet.
     */
    if (emailChanged && !this.isEmailChangeSuccessful()) {
      this.requestEmailChange(email);
      return;
    }

    /**
     * If a verification request has already been sent,
     * the user must enter the code.
     */
    if (this.isEmailChangeSuccessful()) {
      const code = String(
        value['emailVerificationCode'] ?? '',
      ).trim();

      if (!code) {
        this.toastr.warning(
          'Please enter the verification code sent to your email.',
        );
        return;
      }

      this.confirmEmailChange(code, value);
      return;
    }

    /**
     * No email change → update profile normally.
     */
    this.updateProfile(value);
  }

  /**
   * Request email change
   */
  private requestEmailChange(newEmail: string): void {
    const emailData: EmailChangeRequest = {
      newEmail,
    };

    this.isLoading.set(true);

    this.profileService
      .requestEmailChange(emailData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res:EmailChangeResponse) => {
          this.isLoading.set(false);
        },
      });
  }

  /**
   * Confirm email change
   */
  private confirmEmailChange(
    code: string,
    formValue: Record<string, unknown>,
  ): void {
    const confirmData: EmailConfirmRequest = {
      code,
    };

    this.isLoading.set(true);

    this.profileService
      .confirmEmailChange(confirmData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res:ProfileResponse) => {
          this.isLoading.set(false);

          if (res.status && res.payload?.user) {
            this.isEmailChangeSuccessful.set(false);

            const updatedEmail = res.payload.user.email || '';

            this.originalEmail.set(updatedEmail);

            /**
             * Update DynamicForm value by rebuilding initial values.
             */
            this.initialValues.update((current) => ({
              ...current,
              email: updatedEmail,
              emailVerificationCode: '',
            }));


            this.updateAuthSession(res.payload.user);

            /**
             * Now update the rest of the profile.
             */
            this.updateProfile(formValue);
          }
        },

      });
  }

  /**
   * Update profile
   */
  private updateProfile(value: Record<string, unknown>): void {
    this.isLoading.set(true);

    let formattedPhone = String(value['phone'] ?? '').trim();

    formattedPhone = this.formatPhone(formattedPhone);

    const updateData: UpdateProfileRequest = {
      firstName: String(value['firstName'] ?? ''),
      lastName: String(value['lastName'] ?? ''),
      phone: formattedPhone,
    };

    /**
     * Avatar
     *
     * DynamicForm returns:
     *
     * File | null
     */
    const avatar = value['avatar'];

    if (avatar instanceof File) {
      this.uploadAvatarAndUpdateProfile(
        avatar,
        updateData,
      );

      return;
    }

    /**
     * If there is no new image, update profile directly.
     */
    const uploadedPhoto = this.uploadedPhotoUrl();

    if (uploadedPhoto) {
      updateData.photo = uploadedPhoto;
    }

    this.sendUpdateProfile(updateData);
  }

  /**
   * Upload image first, then update profile.
   */
  private uploadAvatarAndUpdateProfile(
    file: File,
    updateData: UpdateProfileRequest,
  ): void {
    this.profileService
      .uploadImage(file)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res:any) => {
          if (res.status && res.payload?.url) {
            const photoUrl = res.payload.url;

            this.uploadedPhotoUrl.set(photoUrl);

            updateData.photo = photoUrl;

            this.sendUpdateProfile(updateData);
          }
        },

      });
  }

  /**
   * Actual profile update API call
   */
  private sendUpdateProfile(
    updateData: UpdateProfileRequest,
  ): void {
    this.profileService
      .updateProfile(updateData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res:any) => {
          this.isLoading.set(false);

          if (res.status) {
            this.uploadedPhotoUrl.set(null);


            if (res.payload?.user) {
              this.updateAuthSession(res.payload.user);

              this.updateInitialValues(res.payload.user);
            }
          }
        },
      });
  }

  /**
   * Format phone number before sending it to the API.
   */
  private formatPhone(phone: string): string {
    if (!phone) {
      return '';
    }

    if (phone.startsWith('+')) {
      return phone;
    }

    if (phone.startsWith('00')) {
      return '+' + phone.substring(2);
    }

    if (phone.startsWith('0')) {
      return '+2' + phone;
    }

    if (phone.startsWith('20')) {
      return '+' + phone;
    }

    return '+20' + phone;
  }

  /**
   * Update AuthSession after profile changes.
   */
  private updateAuthSession(user: UserProfile): void {
    const currentToken = this.authSession.token();

    if (!currentToken) {
      return;
    }

    this.authSession.setSession({
      user: user as any,
      token: currentToken,
    });
  }

  /**
   * Password form
   */
onSavePassword(event: DynamicFormSubmitEvent): void {
    if (!event.valid) {
      return;
    }

    const value = event.value;

    const currentPassword = String(value['currentPassword'] ?? '');
    const newPassword = String(value['newPassword'] ?? '');
    const confirmPassword = String(value['confirmPassword'] ?? '');

    // التحقق من تطابق كلمة المرور الجديدة مع التأكيد
    if (newPassword !== confirmPassword) {
      this.toastr.error('New password and confirmation do not match');
      return;
    }

    this.isLoading.set(true);

    this.changePasswordService
      .changePassword({ currentPassword, newPassword, confirmPassword })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.isLoading.set(false);

          if (res.status) {
            this.toastr.success(res.message || 'Password updated successfully');
            this.currentView.set('settings');
          } else {
            this.toastr.error(res.message || 'Failed to update password');
          }
        },
        error: (err: any) => {
          this.isLoading.set(false);
          this.toastr.error(
            err?.error?.message || 'Failed to update password'
          );
        },
      });
  }

  /**
   * Delete account
   */
  openDeleteDialog(): void {
    // Connect your existing delete dialog here.
    // For now:
    this.deleteAccount();
  }
   closeDeleteDialog(): void {
    if (this.isDeleting()) {
      return;
    }

    this.isDeleteDialogOpen.set(false);
  }

  deleteAccount(): void {
    if (this.isDeleting()) {
      return;
    }

    this.isDeleting.set(true);

    this.profileService
      .deleteAccount()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res:any) => {
          this.isDeleting.set(false);

          if (res.status !== false) {
            this.toastr.success(
              'Account deleted successfully',
            );

            this.authSession.logout();

            void this.router.navigate([
              '/authApp/login',
            ]);
          }
        }
      });
  }
}

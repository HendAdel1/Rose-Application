import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { vi, describe, beforeEach, it, expect } from 'vitest';

import { AccountSettings } from './account-settings';
import { AuthSessionService } from '@org/auth-data-access';
import { ProfileService, UserProfile, DynamicFormSubmitEvent } from '@org/shared-components';

describe('AccountSettings', () => {
  let component: AccountSettings;
  let fixture: ComponentFixture<AccountSettings>;

  // Spies / Mocks
  let profileServiceMock: {
    getProfile: ReturnType<typeof vi.fn>;
    requestEmailChange: ReturnType<typeof vi.fn>;
    confirmEmailChange: ReturnType<typeof vi.fn>;
    uploadImage: ReturnType<typeof vi.fn>;
    updateProfile: ReturnType<typeof vi.fn>;
    deleteAccount: ReturnType<typeof vi.fn>;
  };

  let authSessionMock: {
    currentUser: ReturnType<typeof vi.fn>;
    token: ReturnType<typeof vi.fn>;
    setSession: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };

  let toastrMock: {
    success: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
    warning: ReturnType<typeof vi.fn>;
  };

  let routerMock: {
    navigate: ReturnType<typeof vi.fn>;
  };

  const mockUser:Partial<UserProfile> = {
    firstName: 'Jonathan',
    lastName: 'Adrian',
    email: 'jonathan@gmail.com',
    phone: '1012345678',
    gender: 'male',
    photo: 'https://example.com/avatar.png',
  };

  beforeEach(async () => {
    profileServiceMock = {
      getProfile: vi.fn().mockReturnValue(of({ status: true, payload: { user: mockUser } })),
      requestEmailChange: vi.fn(),
      confirmEmailChange: vi.fn(),
      uploadImage: vi.fn(),
      updateProfile: vi.fn(),
      deleteAccount: vi.fn(),
    };

    authSessionMock = {
      currentUser: vi.fn().mockReturnValue(mockUser),
      token: vi.fn().mockReturnValue('fake-token'),
      setSession: vi.fn(),
      logout: vi.fn(),
    };

    toastrMock = {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
    };

    routerMock = {
      navigate: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [AccountSettings],
      providers: [
        { provide: ProfileService, useValue: profileServiceMock },
        { provide: AuthSessionService, useValue: authSessionMock },
        { provide: ToastrService, useValue: toastrMock },
        { provide: Router, useValue: routerMock },
        {
      provide: TranslateService,
      useValue: {
        get: () => of(''),
        instant: (key: string) => key,
        stream: () => of(''),
      },
    },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSettings);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit & loadProfile', () => {
    it('should load profile successfully on init and update initialValues signal', () => {
      fixture.detectChanges(); // triggers ngOnInit

      expect(profileServiceMock.getProfile).toHaveBeenCalled();
      expect(component.isLoading()).toBe(false);
      expect(component.initialValues()['email']).toBe('jonathan@gmail.com');
      expect(component.accountConfig.fields[0].existingFileUrl).toBe('https://example.com/avatar.png');
    });

    it('should handle profile load error and fallback to authSession user', () => {
      profileServiceMock.getProfile.mockReturnValue(throwError(() => new Error('API Error')));

      fixture.detectChanges();

      expect(toastrMock.error).toHaveBeenCalledWith('Failed to load profile data');
      expect(authSessionMock.currentUser).toHaveBeenCalled();
      expect(component.initialValues()['firstName']).toBe('Jonathan');
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('onSaveAccount', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should ignore form submission if invalid', () => {
      const event: DynamicFormSubmitEvent = { valid: false, value: {} };
      component.onSaveAccount(event);

      expect(profileServiceMock.requestEmailChange).not.toHaveBeenCalled();
      expect(profileServiceMock.updateProfile).not.toHaveBeenCalled();
    });

    it('should trigger requestEmailChange if email was modified', () => {
      profileServiceMock.requestEmailChange.mockReturnValue(
        of({ status: true, message: 'Code sent' })
      );

      const event: DynamicFormSubmitEvent = {
        valid: true,
        value: {
          firstName: 'Jonathan',
          lastName: 'Adrian',
          email: 'newemail@gmail.com',
          phone: '1012345678',
        },
      };

      component.onSaveAccount(event);

      expect(profileServiceMock.requestEmailChange).toHaveBeenCalledWith({ newEmail: 'newemail@gmail.com' });
      expect(component.isEmailChangeSuccessful()).toBe(true);
      expect(toastrMock.success).toHaveBeenCalledWith('Code sent');
    });

    it('should warn user if verification code is missing when isEmailChangeSuccessful is true', () => {
      component.isEmailChangeSuccessful.set(true);

      const event: DynamicFormSubmitEvent = {
        valid: true,
        value: { email: 'newemail@gmail.com', emailVerificationCode: '' },
      };

      component.onSaveAccount(event);

      expect(toastrMock.warning).toHaveBeenCalledWith(
        'Please enter the verification code sent to your email.'
      );
    });

    it('should confirm email change when verification code is provided', () => {
      component.isEmailChangeSuccessful.set(true);
      const updatedUser = { ...mockUser, email: 'newemail@gmail.com' };

      profileServiceMock.confirmEmailChange.mockReturnValue(
        of({ status: true, payload: { user: updatedUser } })
      );
      profileServiceMock.updateProfile.mockReturnValue(of({ status: true }));

      const event: DynamicFormSubmitEvent = {
        valid: true,
        value: {
          email: 'newemail@gmail.com',
          emailVerificationCode: '123456',
          firstName: 'Jonathan',
          lastName: 'Adrian',
          phone: '1012345678',
        },
      };

      component.onSaveAccount(event);

      expect(profileServiceMock.confirmEmailChange).toHaveBeenCalledWith({ code: '123456' });
      expect(component.isEmailChangeSuccessful()).toBe(false);
      expect(toastrMock.success).toHaveBeenCalledWith('Email updated successfully');
    });

    it('should update profile directly if email was not changed', () => {
      profileServiceMock.updateProfile.mockReturnValue(
        of({ status: true, payload: { user: mockUser } })
      );

      const event: DynamicFormSubmitEvent = {
        valid: true,
        value: {
          firstName: 'Jonathan',
          lastName: 'Adrian',
          email: 'jonathan@gmail.com',
          phone: '01012345678',
        },
      };

      component.onSaveAccount(event);

      expect(profileServiceMock.updateProfile).toHaveBeenCalledWith({
        firstName: 'Jonathan',
        lastName: 'Adrian',
        phone: '+21012345678',
      });
      expect(toastrMock.success).toHaveBeenCalledWith('Profile updated successfully');
    });

    it('should upload avatar first if a File instance is provided', () => {
      const mockFile = new File([''], 'avatar.png', { type: 'image/png' });
      profileServiceMock.uploadImage.mockReturnValue(
        of({ status: true, payload: { url: 'https://cdn.example.com/new-avatar.png' } })
      );
      profileServiceMock.updateProfile.mockReturnValue(of({ status: true }));

      const event: DynamicFormSubmitEvent = {
        valid: true,
        value: {
          avatar: mockFile,
          firstName: 'Jonathan',
          lastName: 'Adrian',
          email: 'jonathan@gmail.com',
          phone: '1012345678',
        },
      };

      component.onSaveAccount(event);

      expect(profileServiceMock.uploadImage).toHaveBeenCalledWith(mockFile);
      expect(toastrMock.success).toHaveBeenCalledWith('Photo uploaded successfully');
      expect(profileServiceMock.updateProfile).toHaveBeenCalledWith(
        expect.objectContaining({ photo: 'https://cdn.example.com/new-avatar.png' })
      );
    });
  });

  describe('formatPhone Utility', () => {
    it('should format Egyptian phone numbers correctly', () => {
      const formatPhone = (component as any).formatPhone.bind(component);

      expect(formatPhone('')).toBe('');
      expect(formatPhone('+201012345678')).toBe('+201012345678');
      expect(formatPhone('00201012345678')).toBe('+201012345678');
      expect(formatPhone('01012345678')).toBe('+201012345678');
      expect(formatPhone('201012345678')).toBe('+201012345678');
      expect(formatPhone('1012345678')).toBe('+201012345678');
    });
  });

  describe('onSavePassword', () => {
    it('should switch view back to settings on valid submit', () => {
      component.currentView.set('password');

      const event: DynamicFormSubmitEvent = { valid: true, value: {} };
      component.onSavePassword(event);

      expect(component.currentView()).toBe('settings');
    });

    it('should do nothing if password form is invalid', () => {
      component.currentView.set('password');

      const event: DynamicFormSubmitEvent = { valid: false, value: {} };
      component.onSavePassword(event);

      expect(component.currentView()).toBe('password');
    });
  });

  describe('deleteAccount', () => {
    it('should handle successful account deletion', () => {
      profileServiceMock.deleteAccount.mockReturnValue(of({ status: true }));

      component.deleteAccount();

      expect(profileServiceMock.deleteAccount).toHaveBeenCalled();
      expect(toastrMock.success).toHaveBeenCalledWith('Account deleted successfully');
      expect(authSessionMock.logout).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/authApp/login']);
    });

    it('should close delete dialog via closeDeleteDialog()', () => {
      component.isDeleteDialogOpen.set(true);

      component.closeDeleteDialog();

      expect(component.isDeleteDialogOpen()).toBe(false);
    });
  });
});

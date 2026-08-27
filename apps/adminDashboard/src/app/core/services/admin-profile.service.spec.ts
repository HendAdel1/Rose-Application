import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthSessionService } from '@org/auth-data-access';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { AdminProfileService } from './admin-profile.service';

describe('AdminProfileService', () => {
  let service: AdminProfileService;
  const logoutMock = vi.fn();
  const navigateMock = vi.fn();
  const mockUser = signal<{ firstName?: string; lastName?: string; email?: string; photo?: string } | null>({
    firstName: 'Jonathan',
    lastName: 'Adrian',
    email: 'jonathan@example.com',
  });

  beforeEach(() => {
    mockUser.set({
      firstName: 'Jonathan',
      lastName: 'Adrian',
      email: 'jonathan@example.com',
    });

    TestBed.configureTestingModule({
      providers: [
        AdminProfileService,
        {
          provide: AuthSessionService,
          useValue: {
            currentUser: mockUser,
            isAuthenticated: signal(true),
            logout: logoutMock,
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: navigateMock,
          },
        },
      ],
    });

    service = TestBed.inject(AdminProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should compute userDisplayName, email, initial, and avatar colors', () => {
    expect(service.userDisplayName()).toBe('Jonathan Adrian');
    expect(service.userEmail()).toBe('jonathan@example.com');
    expect(service.avatarInitial()).toBe('J');
    expect(service.avatarColors().bg).toBeTruthy();
  });

  it('should fallback properly when user has no names', () => {
    mockUser.set({ email: 'sara@example.com' });
    expect(service.userDisplayName()).toBe('Admin User');
    expect(service.avatarInitial()).toBe('S');
  });

  it('should logout and redirect to store', () => {
    service.logout();
    expect(logoutMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith(['/roseApp']);
  });
});

import { Injectable, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthSessionService } from '@org/auth-data-access';
import { getAvatarColor, getUserInitial } from '../utils/avatar-color.util';

@Injectable({ providedIn: 'root' })
export class AdminProfileService {
  private readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);

  readonly currentUser = this.authSession.currentUser;

  readonly userDisplayName = computed(() => {
    const user = this.currentUser();
    if (!user) return 'Admin User';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.firstName ?? user.username ?? 'Admin User';
  });

  readonly userEmail = computed(() => {
    const user = this.currentUser();
    return user?.email ?? 'admin@rose.com';
  });

  readonly userPhoto = computed(() => {
    const user = this.currentUser() as { photo?: string; avatar?: string } | null;
    return user?.photo ?? user?.avatar ?? null;
  });

  readonly avatarInitial = computed(() => {
    const user = this.currentUser();
    return getUserInitial(user?.firstName || user?.username, user?.email);
  });

  readonly avatarColors = computed(() => {
    const user = this.currentUser();
    const identifier = user?.email || user?.username || user?.firstName || 'admin';
    return getAvatarColor(identifier);
  });

  logout(redirectUrl = '/roseApp'): void {
    this.authSession.logout();
    void this.router.navigate([redirectUrl]);
  }
}

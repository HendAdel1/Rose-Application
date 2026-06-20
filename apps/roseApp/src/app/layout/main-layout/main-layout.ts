import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthSessionService } from '@org/auth-data-access';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';

@Component({
  imports: [Footer, Navbar, RouterOutlet],
  selector: 'app-main-layout',
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private readonly authSession = inject(AuthSessionService);

  readonly isAuthenticated = this.authSession.isAuthenticated;
  readonly currentUserName = computed(() => {
    const user = this.authSession.currentUser();

    return user?.firstName ?? user?.username ?? '';
  });
}

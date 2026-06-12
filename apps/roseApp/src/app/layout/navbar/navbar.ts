import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navbar',
  template: `
    <nav class="navbar" aria-label="Primary navigation" i18n-aria-label>
      <a class="brand" routerLink="./" i18n>Rose Application</a>

      <ul class="nav-links">
        <li>
          <a
            routerLink="./"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            i18n
            >Home</a
          >
        </li>
      </ul>
    </nav>
  `,
  styleUrl: './navbar.css',
})
export class Navbar {}

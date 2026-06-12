import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';

@Component({
  imports: [Footer, Navbar, RouterOutlet],
  selector: 'app-main-layout',
  template: `
    <div class="app-layout">
      <app-navbar></app-navbar>
      <main class="app-content">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styleUrl: './main-layout.css',
})
export class MainLayout {}

import { Component } from '@angular/core';
import { AboutUs } from './components/about-us/about-us';
import { Gallery } from './components/gallery/gallery';
import { TrustedBy } from './components/trusted-by/trusted-by';

@Component({
  selector: 'app-home',
  imports: [Gallery, TrustedBy, AboutUs],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}

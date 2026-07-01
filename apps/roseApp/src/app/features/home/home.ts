import { Component } from '@angular/core';
import { AboutUs } from './components/about-us/about-us';
import { Gallery } from './components/gallery/gallery';
import { Testimonials } from './components/testimonials/testimonials';
import { MostPopular } from './components/most-popular/most-popular';
import { TrustedBy } from './components/trusted-by/trusted-by';

@Component({
  selector: 'app-home',
  imports: [Gallery, Testimonials, TrustedBy, MostPopular, AboutUs],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}

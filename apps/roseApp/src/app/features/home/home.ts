import { Component } from '@angular/core';
import { Gallery } from './components/gallery/gallery';
import { Testimonials } from './components/testimonials/testimonials';
import { TrustedBy } from './components/trusted-by/trusted-by';

@Component({
  selector: 'app-home',
  imports: [Gallery, Testimonials, TrustedBy],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}

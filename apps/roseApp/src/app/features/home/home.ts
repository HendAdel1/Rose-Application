import { Component } from '@angular/core';
import { AboutUs } from './components/about-us/about-us';
import { Gallery } from './components/gallery/gallery';
import { MostPopular } from './components/most-popular/most-popular';
import { TrustedBy } from './components/trusted-by/trusted-by';

@Component({
  selector: 'app-home',
  imports: [Gallery, TrustedBy, MostPopular],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}

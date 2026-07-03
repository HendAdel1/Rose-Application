import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AboutUs } from './components/about-us/about-us';
import { Gallery } from './components/gallery/gallery';
import { Testimonials } from './components/testimonials/testimonials';
import { MostPopular } from './components/most-popular/most-popular';
import { TrustedBy } from './components/trusted-by/trusted-by';
import { BestSelling } from './components/best-selling/best-selling';
import { SpecialGifts } from './components/special-gifts/special-gifts';
import { Occaisions } from './components/occaisions/occaisions';
import { FeaturesBar } from './components/features-bar/features-bar';

@Component({
  selector: 'app-home',
  imports: [
    Gallery,
    Testimonials,
    TrustedBy,
    MostPopular,
    AboutUs,
    BestSelling,
    SpecialGifts,
    Occaisions,
    FeaturesBar
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}

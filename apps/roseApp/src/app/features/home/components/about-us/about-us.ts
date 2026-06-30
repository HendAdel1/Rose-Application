import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowRight, LucideCheck } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';

interface AboutImage {
  src: string;
  altKey: string;
  className: string;
  category: string;
}

@Component({
  selector: 'app-about-us',
  imports: [RouterLink, LucideArrowRight, LucideCheck, TranslatePipe],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {
  readonly images: AboutImage[] = [
    {
      src: '/images/about-1.webp',
      altKey: 'HOME.ABOUT.IMAGE_ONE_ALT',
      className: 'hero-link',
      category: 'gift-boxes',
    },
    {
      src: '/images/about-2.webp',
      altKey: 'HOME.ABOUT.IMAGE_TWO_ALT',
      className: 'circle-link',
      category: 'chocolates',
    },
    {
      src: '/images/about-3.webp',
      altKey: 'HOME.ABOUT.IMAGE_THREE_ALT',
      className: 'small-link',
      category: 'occasions',
    },
  ];
}

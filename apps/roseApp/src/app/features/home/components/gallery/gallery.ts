import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CustomHeading } from '../../../../shared/custom-heading/custom-heading';

interface GalleryImage {
  src: string;
  alt: string;
  ratioClass: string;
  aspectClass: string;
}

interface GalleryColumn {
  images: GalleryImage[];
}

@Component({
  selector: 'app-gallery',
  imports: [CustomHeading, TranslatePipe],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery {
  readonly columns: GalleryColumn[] = [
    {
      images: [
        {
          src: '/images/g1.webp',
          alt: 'Gift boxes with wedding and birthday tags',
          ratioClass: 'gallery-image--ratio-13',
          aspectClass: 'aspect-4/5',
        },
        {
          src: '/images/g4.webp',
          alt: 'Pink roses and heart-shaped chocolates',
          ratioClass: 'gallery-image--ratio-7',
          aspectClass: 'aspect-square',
        },
      ],
    },
    {
      images: [
        {
          src: '/images/g2.webp',
          alt: 'Red gift boxes with wedding rings',
          ratioClass: 'gallery-image--ratio-13',
          aspectClass: 'aspect-square',
        },
        {
          src: '/images/g5.webp',
          alt: 'Engagement ring in a box surrounded by flowers',
          ratioClass: 'gallery-image--ratio-13',
          aspectClass: 'aspect-4/5',
        },
      ],
    },
    {
      images: [
        {
          src: '/images/g3.webp',
          alt: 'Engagement ring in a box with daisies',
          ratioClass: 'gallery-image--ratio-13',
          aspectClass: 'aspect-square',
        },
        {
          src: '/images/g6.webp',
          alt: 'Engagement ring in a box with a congratulations card',
          ratioClass: 'gallery-image--ratio-13',
          aspectClass: 'aspect-4/5',
        },
      ],
    },
  ];
}

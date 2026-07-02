import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { Banner } from '../../interface/Banner/banner';
import { Gift } from '../../interface/Gift/gift';
import { LucideArrowRight } from '@lucide/angular';

@Component({
  selector: 'app-special-gifts',
  imports: [CarouselModule,CommonModule,LucideArrowRight ],
  templateUrl: './special-gifts.html',
  styleUrl: './special-gifts.css',
  encapsulation:ViewEncapsulation.None
})
export class SpecialGifts implements OnInit {
  banners:Banner[]=[];
  gifts:Gift[]=[]
  ngOnInit(): void {
    this.banners = [
      {
        title: 'Say It with Flowers',
        subtitle: 'Elegant gifts for every special moment.',
        image: 'special-gifts/banner.png',
        buttonText: "I'm buying!"
      },
      {
        title: 'Share the Love',
        subtitle: 'Find the perfect chocolate boxes and combos.',
        image: 'special-gifts/banner.png',
        buttonText: 'Explore More'
      }
    ];
  }
}

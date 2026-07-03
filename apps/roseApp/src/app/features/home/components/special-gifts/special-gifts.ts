import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { Banner } from '../../interface/Banner/banner';
import { Gift } from '../../interface/Gift/gift';
import { LucideArrowRight, LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-special-gifts',
  imports: [
    CarouselModule,
    CommonModule,
    LucideArrowRight,
    LucideChevronLeft,
    LucideChevronRight,
    TranslatePipe,
  ],
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
        title: 'HOME.SPECIAL_GIFTS.BANNERS.FLOWERS.TITLE',
        subtitle: 'HOME.SPECIAL_GIFTS.BANNERS.FLOWERS.SUBTITLE',
        image: 'special-gifts/banner.png',
        buttonText: 'HOME.SPECIAL_GIFTS.BANNERS.FLOWERS.BUTTON'
      },
      {
        title: 'HOME.SPECIAL_GIFTS.BANNERS.LOVE.TITLE',
        subtitle: 'HOME.SPECIAL_GIFTS.BANNERS.LOVE.SUBTITLE',
        image: 'special-gifts/banner.png',
        buttonText: 'HOME.SPECIAL_GIFTS.BANNERS.LOVE.BUTTON'
      }
    ];
  }
}

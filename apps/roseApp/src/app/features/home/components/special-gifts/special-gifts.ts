import { Component, computed, OnDestroy, signal } from '@angular/core';
import { Banner } from '../../interface/Banner/banner';
import { LucideArrowRight, LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-special-gifts',
  imports: [
    LucideArrowRight,
    LucideChevronLeft,
    LucideChevronRight,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './special-gifts.html',
  styleUrl: './special-gifts.css',
})
export class SpecialGifts implements OnDestroy {
  readonly banners: Banner[] = [
    {
      title: 'HOME.SPECIAL_GIFTS.BANNERS.FLOWERS.TITLE',
      subtitle: 'HOME.SPECIAL_GIFTS.BANNERS.FLOWERS.SUBTITLE',
      image: 'special-gifts/banner.png',
      buttonText: 'HOME.SPECIAL_GIFTS.BANNERS.FLOWERS.BUTTON',
    },
    {
      title: 'HOME.SPECIAL_GIFTS.BANNERS.LOVE.TITLE',
      subtitle: 'HOME.SPECIAL_GIFTS.BANNERS.LOVE.SUBTITLE',
      image: 'special-gifts/gifts.png',
      buttonText: 'HOME.SPECIAL_GIFTS.BANNERS.LOVE.BUTTON',
    },
  ];

  readonly activeBannerIndex = signal(0);
  readonly activeBanner = computed(() => this.banners[this.activeBannerIndex()]);

  private readonly autoplay = window.setInterval(() => this.showNextBanner(), 4000);

  ngOnDestroy(): void {
    window.clearInterval(this.autoplay);
  }

  showPreviousBanner(): void {
    this.activeBannerIndex.update((index) =>
      index === 0 ? this.banners.length - 1 : index - 1,
    );
  }

  showNextBanner(): void {
    this.activeBannerIndex.update((index) => (index + 1) % this.banners.length);
  }

  selectBanner(index: number): void {
    this.activeBannerIndex.set(index);
  }
}

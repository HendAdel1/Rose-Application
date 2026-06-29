import { DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideStar } from '@lucide/angular';

import { CustomHeading } from '../../../../shared/custom-heading/custom-heading';
import { Testimonial } from './models/testimonial.model';
import { TestimonialsApiService } from './services/testimonials-api.service';

@Component({
  selector: 'app-testimonials',
  imports: [DatePipe, LucideStar, CustomHeading],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',
})
export class Testimonials implements OnInit {
  private readonly testimonialsApi = inject(TestimonialsApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly testimonials = signal<Testimonial[]>([]);
  readonly loading = signal(true);
  private readonly failedAvatarIds = signal<Set<string>>(new Set());

  readonly marqueeItems = computed(() => {
    const items = this.testimonials();
    return items.length ? [...items, ...items] : [];
  });

  ngOnInit(): void {
    this.testimonialsApi
      .getTestimonials()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.testimonials.set(items);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  showAvatar(testimonial: Testimonial): boolean {
    return !!testimonial.avatarUrl && !this.failedAvatarIds().has(testimonial.id);
  }

  onAvatarError(id: string): void {
    this.failedAvatarIds.update((ids) => new Set(ids).add(id));
  }

  initials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return name.trim().slice(0, 2).toUpperCase();
  }

  stars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, index) => index < rating);
  }
}

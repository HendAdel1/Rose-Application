import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LucideHeadset, LucideRefreshCw, LucideShieldCheck, LucideTruck } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { SharedI18nService } from '@org/shared-i18n';

@Component({
  selector: 'app-features-bar',
  imports: [CommonModule,LucideTruck, LucideHeadset, LucideShieldCheck, LucideRefreshCw, TranslatePipe],
  templateUrl: './features-bar.html',
  styleUrl: './features-bar.css',
})
export class FeaturesBar  {
private readonly sharedI18nService=inject(SharedI18nService)
}

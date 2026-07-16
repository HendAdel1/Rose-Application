import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
export interface GenericCardConfig {
  image: string;
  badgeText?: string;
  badgeType?: 'default' | 'danger' | 'warning';
  isDimmed?: boolean;
  isOverlay?: boolean;
}

@Component({
  selector: 'app-newcard',
  imports: [CommonModule],
  templateUrl: './newcard.html',
  styleUrl: './newcard.css',
})
export class Newcard {
  @Input() config!: GenericCardConfig;
}

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  templateUrl: './categories.html',
  styleUrl: './categories.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Categories {}

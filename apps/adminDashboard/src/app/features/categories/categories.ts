import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LucidePlus } from '@lucide/angular';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [TranslatePipe, LucidePlus],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Categories {
  readonly categories = [
    { id: 1, name: 'Cards', productCount: 12, status: 'Active' },
    { id: 2, name: 'Chocolate', productCount: 24, status: 'Active' },
    { id: 3, name: 'Flowers', productCount: 48, status: 'Active' },
  ];
}

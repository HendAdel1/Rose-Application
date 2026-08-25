import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LucidePlus } from '@lucide/angular';

@Component({
  selector: 'app-admin-occasions',
  standalone: true,
  imports: [TranslatePipe, LucidePlus],
  templateUrl: './occasions.html',
  styleUrl: './occasions.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Occasions {
  readonly occasions = [
    { id: 1, name: 'Wedding', productCount: 18, status: 'Active' },
    { id: 2, name: 'Engagement', productCount: 15, status: 'Active' },
    { id: 3, name: 'Anniversary', productCount: 22, status: 'Active' },
    { id: 4, name: 'Birthday', productCount: 30, status: 'Active' },
  ];
}

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-occasions',
  standalone: true,
  templateUrl: './occasions.html',
  styleUrl: './occasions.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Occasions {}

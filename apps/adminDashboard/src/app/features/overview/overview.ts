import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  templateUrl: './overview.html',
  styleUrl: './overview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overview {}

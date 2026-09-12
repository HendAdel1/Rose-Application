import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Unauthorized {
  dashboardUrl = '/adminDashboard/overview';
}

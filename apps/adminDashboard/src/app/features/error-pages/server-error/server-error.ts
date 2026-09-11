import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './server-error.html',
  styleUrl: './server-error.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerError {
  private readonly document = inject(DOCUMENT);
  dashboardUrl = '/adminDashboard/overview';

  reload(): void {
    const defaultView = this.document.defaultView;
    if (defaultView) {
      defaultView.location.reload();
    }
  }
}

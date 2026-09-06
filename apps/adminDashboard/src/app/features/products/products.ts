import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  templateUrl: './products.html',
  styleUrl: './products.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Products {}

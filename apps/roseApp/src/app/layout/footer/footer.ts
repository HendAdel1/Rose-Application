import { Component } from '@angular/core';
import { LucideArrowRight } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { CustomInput } from '@org/shared-components';

@Component({
  imports: [TranslatePipe, CustomInput, LucideArrowRight],
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {}

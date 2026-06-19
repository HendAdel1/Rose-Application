import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CustomInput } from '../../../../../../libs/sharedComponents/src';

@Component({
  imports: [TranslatePipe, CustomInput],
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {}

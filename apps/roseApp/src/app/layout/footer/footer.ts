import { Component } from '@angular/core';
import { CustomInput } from '../../../../../../libs/sharedComponents/src/lib/sharedComponents/reusable-input/custom-input';

@Component({
  imports: [CustomInput],
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {}

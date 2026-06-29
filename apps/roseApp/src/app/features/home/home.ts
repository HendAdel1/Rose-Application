import { Component } from '@angular/core';
import { TrustedBy } from './components/trusted-by/trusted-by';

@Component({
  selector: 'app-home',
  imports:[TrustedBy],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}

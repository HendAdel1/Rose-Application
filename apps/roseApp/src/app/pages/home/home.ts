import { Component } from '@angular/core';
import { MostPopular } from './components/most-popular/most-popular';

@Component({
  selector: 'app-home',
  imports: [MostPopular],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}

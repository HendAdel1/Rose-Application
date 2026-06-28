import { Component } from '@angular/core';
import { Gallery } from './components/gallery/gallery';

@Component({
  selector: 'app-home',
  imports: [Gallery],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}

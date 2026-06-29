import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowRight, LucideCheck } from '@lucide/angular';

@Component({
  selector: 'app-about-us',
  imports: [RouterLink, LucideArrowRight, LucideCheck],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {}

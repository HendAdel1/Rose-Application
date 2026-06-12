import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';
import { NgxSpinnerModule } from "ngx-spinner";


@Component({
  imports: [NxWelcome, RouterModule,NgxSpinnerModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'shell';
}

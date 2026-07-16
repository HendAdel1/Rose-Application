import { Component, OnInit } from '@angular/core';
import { Gift } from '../../interface/Gift/gift';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-occaisions',
  imports: [TranslatePipe],
  templateUrl: './occaisions.html',
  styleUrl: './occaisions.css',
})
export class Occaisions implements OnInit {
  occasionsList:Gift[]=[]
  ngOnInit(): void {
   this.occasionsList = [
      {
        badge: 'HOME.OCCASIONS.WEDDING.BADGE',
        title: 'HOME.OCCASIONS.WEDDING.TITLE',
        image: 'gifts/wedding.png'
      },
      {
        badge: 'HOME.OCCASIONS.ENGAGEMENT.BADGE',
        title: 'HOME.OCCASIONS.ENGAGEMENT.TITLE',
        image: 'gifts/engage.png'
      },
      {
        badge: 'HOME.OCCASIONS.ANNIVERSARY.BADGE',
        title: 'HOME.OCCASIONS.ANNIVERSARY.TITLE',
        image: 'gifts/anniversary.png'
      }
    ];

  }
}

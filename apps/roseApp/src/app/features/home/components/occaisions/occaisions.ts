import { Component, OnInit } from '@angular/core';
import { Newcard } from '../../../../shared/newcard/newcard';
import { Gift } from '../../interface/Gift/gift';

@Component({
  selector: 'app-occaisions',
  imports: [Newcard],
  templateUrl: './occaisions.html',
  styleUrl: './occaisions.css',
})
export class Occaisions implements OnInit {
  occasionsList:Gift[]=[]
  ngOnInit(): void {
   this.occasionsList = [
      {
        badge: 'Wedding',
        title: "Celebrate Her Forever with a Gift She'll Always Remember",
        image: 'gifts/wedding.png'
      },
      {
        badge: 'Engagement',
        title: 'Honor the Beginning of a Beautiful Journey Together',
        image: 'gifts/engage.png'
      },
      {
        badge: 'Anniversary',
        title: 'Mark Every Year of Love with a Meaningful Surprise',
        image: 'gifts/anniversary.png'
      }
    ];

  }
}

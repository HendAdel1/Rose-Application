import { Component, inject } from '@angular/core';
import {  TranslatePipe } from '@ngx-translate/core';
import { SharedI18nService } from '@org/shared-i18n';

@Component({
  selector: 'app-trusted-by',
  imports: [TranslatePipe],
  templateUrl: './trusted-by.html',
  styleUrl: './trusted-by.css',
})
export class TrustedBy {
  private readonly sharedI18nService=inject(SharedI18nService)
  imagesUrl:string[]=['trusted/nut.png','trusted/ginyard.png','trusted/ingoud.png'
    ,'trusted/velvet.png','trusted/goude.png','trusted/habu.png']
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ProductsService } from '../../../../shared/products/services/products.service';
import { BestSelling } from './best-selling';

describe('BestSelling', () => {
  let component: BestSelling;
  let fixture: ComponentFixture<BestSelling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestSelling],
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
        {
          provide: ProductsService,
          useValue: {
            getProducts: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BestSelling);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

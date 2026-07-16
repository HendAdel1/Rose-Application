import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ProductsService } from '../../../../shared/products/services/products.service';
import { MostPopular } from './most-popular';

describe('MostPopular', () => {
  let component: MostPopular;
  let fixture: ComponentFixture<MostPopular>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostPopular],
      providers: [
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
        {
          provide: ProductsService,
          useValue: {
            getProducts: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MostPopular);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

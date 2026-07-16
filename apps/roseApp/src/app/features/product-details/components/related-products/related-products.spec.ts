import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ProductsService } from '../../../../shared/products/services/products.service';
import { RelatedProducts } from './related-products';

describe('RelatedProducts', () => {
  let component: RelatedProducts;
  let fixture: ComponentFixture<RelatedProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedProducts],
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

    fixture = TestBed.createComponent(RelatedProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

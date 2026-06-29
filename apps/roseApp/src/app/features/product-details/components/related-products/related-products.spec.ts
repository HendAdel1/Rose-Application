import { ComponentFixture, TestBed } from '@angular/core/testing';
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
        {
          provide: ProductsService,
          useValue: {
            getProducts: () => of([]),
            buildImageUrl: (path?: string) => path ?? '/images/g1.webp',
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

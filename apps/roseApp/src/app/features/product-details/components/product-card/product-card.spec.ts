import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCard } from './product-card';

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', {
      id: 'test-product',
      title: 'Test Product',
      price: 100,
      cover: '/images/g1.webp',
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

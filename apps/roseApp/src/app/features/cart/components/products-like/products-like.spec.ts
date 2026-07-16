import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsLike } from './products-like';

describe('ProductsLike', () => {
  let component: ProductsLike;
  let fixture: ComponentFixture<ProductsLike>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsLike],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsLike);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

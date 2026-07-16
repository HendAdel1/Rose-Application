import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpecialGifts } from './special-gifts';

describe('SpecialGifts', () => {
  let component: SpecialGifts;
  let fixture: ComponentFixture<SpecialGifts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialGifts],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialGifts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

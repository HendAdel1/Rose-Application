import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MostPopular } from './most-popular';

describe('MostPopular', () => {
  let component: MostPopular;
  let fixture: ComponentFixture<MostPopular>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostPopular],
    }).compileComponents();

    fixture = TestBed.createComponent(MostPopular);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

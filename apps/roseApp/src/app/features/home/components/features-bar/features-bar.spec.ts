import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturesBar } from './features-bar';

describe('FeaturesBar', () => {
  let component: FeaturesBar;
  let fixture: ComponentFixture<FeaturesBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesBar],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturesBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

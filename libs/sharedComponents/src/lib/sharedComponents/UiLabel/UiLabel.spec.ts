import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiLabel } from './UiLabel';

describe('UiLabel', () => {
  let component: UiLabel;
  let fixture: ComponentFixture<UiLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiLabel],
    }).compileComponents();

    fixture = TestBed.createComponent(UiLabel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

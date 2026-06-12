import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiErrorMessage } from './UiErrorMessage';

describe('UiErrorMessage', () => {
  let component: UiErrorMessage;
  let fixture: ComponentFixture<UiErrorMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiErrorMessage],
    }).compileComponents();

    fixture = TestBed.createComponent(UiErrorMessage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

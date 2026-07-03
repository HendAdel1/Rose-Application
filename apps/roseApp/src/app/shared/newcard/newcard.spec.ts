import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Newcard } from './newcard';

describe('Newcard', () => {
  let component: Newcard;
  let fixture: ComponentFixture<Newcard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Newcard],
    }).compileComponents();

    fixture = TestBed.createComponent(Newcard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Occaisions } from './occaisions';

describe('Occaisions', () => {
  let component: Occaisions;
  let fixture: ComponentFixture<Occaisions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Occaisions],
    }).compileComponents();

    fixture = TestBed.createComponent(Occaisions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

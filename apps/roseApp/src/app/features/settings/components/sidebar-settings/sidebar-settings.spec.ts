import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarSettings } from './sidebar-settings';

describe('SidebarSettings', () => {
  let component: SidebarSettings;
  let fixture: ComponentFixture<SidebarSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

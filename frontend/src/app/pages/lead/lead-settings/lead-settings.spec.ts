import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadSettings } from './lead-settings';

describe('LeadSettings', () => {
  let component: LeadSettings;
  let fixture: ComponentFixture<LeadSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

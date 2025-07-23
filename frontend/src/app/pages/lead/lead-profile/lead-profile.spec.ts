import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadProfile } from './lead-profile';

describe('LeadProfile', () => {
  let component: LeadProfile;
  let fixture: ComponentFixture<LeadProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

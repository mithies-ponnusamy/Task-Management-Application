import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadLayout } from './lead-layout';

describe('LeadLayout', () => {
  let component: LeadLayout;
  let fixture: ComponentFixture<LeadLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

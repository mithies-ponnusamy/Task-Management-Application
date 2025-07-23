import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportManagement } from './report-management';

describe('ReportManagement', () => {
  let component: ReportManagement;
  let fixture: ComponentFixture<ReportManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

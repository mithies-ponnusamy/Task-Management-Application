import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceManagement } from './performance-management';

describe('PerformanceManagement', () => {
  let component: PerformanceManagement;
  let fixture: ComponentFixture<PerformanceManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

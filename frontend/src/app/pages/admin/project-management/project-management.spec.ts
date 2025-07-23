import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagement } from './project-management';

describe('ProjectManagement', () => {
  let component: ProjectManagement;
  let fixture: ComponentFixture<ProjectManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

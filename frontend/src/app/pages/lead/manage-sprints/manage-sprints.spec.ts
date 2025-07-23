import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSprints } from './manage-sprints';

describe('ManageSprints', () => {
  let component: ManageSprints;
  let fixture: ComponentFixture<ManageSprints>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSprints]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSprints);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

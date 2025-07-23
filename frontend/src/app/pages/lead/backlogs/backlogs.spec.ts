import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Backlogs } from './backlogs';

describe('Backlogs', () => {
  let component: Backlogs;
  let fixture: ComponentFixture<Backlogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Backlogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Backlogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

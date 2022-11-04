import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VSAChartComponent } from './vsa-chart.component';

describe('VSAChartComponent', () => {
  let component: VSAChartComponent;
  let fixture: ComponentFixture<VSAChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VSAChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VSAChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

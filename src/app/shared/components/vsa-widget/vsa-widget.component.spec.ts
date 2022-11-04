import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VSAWidgetComponent } from './vsa-widget.component';

describe('VSAWidgetComponent', () => {
  let component: VSAWidgetComponent;
  let fixture: ComponentFixture<VSAWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VSAWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VSAWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

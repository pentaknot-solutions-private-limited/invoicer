import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariablesPanelComponent } from './variables-panel.component';

describe('VariablesPanelComponent', () => {
  let component: VariablesPanelComponent;
  let fixture: ComponentFixture<VariablesPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariablesPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VariablesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

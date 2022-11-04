import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CerPanelComponent } from './cer-panel.component';

describe('CerPanelComponent', () => {
  let component: CerPanelComponent;
  let fixture: ComponentFixture<CerPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CerPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

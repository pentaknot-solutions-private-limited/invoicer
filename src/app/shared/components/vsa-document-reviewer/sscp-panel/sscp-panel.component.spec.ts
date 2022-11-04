import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SscpPanelComponent } from './sscp-panel.component';

describe('SscpPanelComponent', () => {
  let component: SscpPanelComponent;
  let fixture: ComponentFixture<SscpPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SscpPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SscpPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

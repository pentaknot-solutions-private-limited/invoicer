import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridExpansionProjectComponent } from './grid-expansion-project.component';

describe('GridExpansionProjectComponent', () => {
  let component: GridExpansionProjectComponent;
  let fixture: ComponentFixture<GridExpansionProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridExpansionProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridExpansionProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VSADocumentReviewerComponent } from './vsa-document-reviewer.component';

describe('VSADocumentReviewerComponent', () => {
  let component: VSADocumentReviewerComponent;
  let fixture: ComponentFixture<VSADocumentReviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VSADocumentReviewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VSADocumentReviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

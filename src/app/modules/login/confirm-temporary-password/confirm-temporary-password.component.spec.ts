import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmTemporaryPasswordComponent } from './confirm-temporary-password.component';

describe('ConfirmTemporaryPasswordComponent', () => {
  let component: ConfirmTemporaryPasswordComponent;
  let fixture: ComponentFixture<ConfirmTemporaryPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmTemporaryPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmTemporaryPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

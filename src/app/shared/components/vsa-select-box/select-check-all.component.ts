import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, NgModel } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'select-check-all',
  template: `
    <mat-checkbox
      class="mat-option select-all"
      [disableRipple]="true"
      [indeterminate]="isIndeterminate()"
      [checked]="isChecked()"
      (click)="$event.stopPropagation()"
      (change)="toggleSelection($event)"
    >
      {{ text }}
    </mat-checkbox>
  `,
  styles: [`
    .mat-option.select-all {    
      border-bottom: 1px solid #e0e0e0;
      position: sticky;
      top: 0;
      background-color: white;
      z-index: 1;
    }
    `],
})
export class SelectCheckAllComponent implements OnInit {
  @Input() model: FormControl;
  @Output() modelChanges: EventEmitter<FormControl> = new EventEmitter();
  @Input() values = [];
  @Input() text = 'Select All';

  constructor() {}

  ngOnInit() {}

  isChecked(): boolean {
    return (
      this.model.value &&
      this.values.length &&
      this.model.value.length === this.values.length
    );
  }

  isIndeterminate(): boolean {
    return (
      this.model.value &&
      this.values.length &&
      this.model.value.length < this.values.length &&
      this.model.value.length > 0
    );
  }

  toggleSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.model.patchValue(this.values);
    } else {
      this.model.patchValue([]);
    }
    this.modelChanges.emit(this.model);
  }
}

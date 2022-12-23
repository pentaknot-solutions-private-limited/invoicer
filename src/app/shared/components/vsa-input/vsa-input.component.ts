import {
  Component,
  Input,
  Output,
  EventEmitter,
  Self,
  Optional,
  OnChanges,
  AfterViewInit,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  Validators,
} from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { DateTimeAdapter } from "ng-pick-datetime";
import { ITextConfig } from "./vsa-input.model";

@Component({
  selector: "vsa-input",
  templateUrl: "./vsa-input.component.html",
  styleUrls: ["./vsa-input.component.scss"]
})
export class VSAInputComponent
  implements ControlValueAccessor, OnChanges, AfterViewInit
{
  @Input() config: ITextConfig = <ITextConfig>{};
  @Input() dataModel: any;
  @Output() onBlur: EventEmitter<any> = new EventEmitter();
  @Output() onDateChange: EventEmitter<any> = new EventEmitter();
  public data?: string;
  disabled: any;
  showPassowrd: boolean;
  isIntervalSet: boolean = false;
  planClient = new FormControl();
  private errorMessages = new Map<string, () => string>();

  public onChangeFn = (_: any) => {};

  public onTouchedFn = () => {};
  filteredData: any[] = [];

  constructor(@Self() @Optional() public control: NgControl) {
    this.control && (this.control.valueAccessor = this);
    this.errorMessages.set("required", () => `This Field is required.`);
    this.errorMessages.set(
      "minlength",
      () => `The No. of characters should not be less than 0.`
    );
    this.errorMessages.set(
      "custom",
      () => "" + this.config?.attributes.errorMessage + ""
    );
    this.showPassowrd = false;
    if (this.control && this.control.control) {
      this.isIntervalSet = true;
      setInterval(() => {
        this.control.control?.patchValue(this.dataModel[this.config.fieldKey]);
      }, 100);
    }
  }

  ngAfterViewInit() {
    this.control && (this.control.valueAccessor = this);
    this.errorMessages.set("required", () => `This Field is required.`);
    this.errorMessages.set(
      "minlength",
      () => `The No. of characters should not be less than 0.`
    );
    this.errorMessages.set(
      "pattern",
      () => "" + this.config?.attributes.customPatternMessage + ""
    );
    if (this.control && this.control.control && this.isIntervalSet == false) {
      this.isIntervalSet = true;
      setInterval(() => {
        this.control.control &&
          this.control.control.patchValue(this.dataModel[this.config.fieldKey]);
      }, 100);
    }
  }

  ngOnChanges() {
    if (this.control)
      if (
        this.config?.attributes.pattern &&
        this.config.attributes.isMandatory
      ) {
        this.control?.control?.setValidators([
          Validators.pattern(this.config.attributes.pattern),
          Validators.required,
        ]);
      } else {
        if (this.config?.attributes.isMandatory) {
          this.control?.control?.setValidators(Validators.required);
        } else if (this.config?.attributes.pattern) {
          this.control?.control?.setValidators([
            Validators.pattern(this.config.attributes.pattern),
          ]);
        }
      }
  }

  // Set Errors on Validation
  public get invalid(): boolean | any {
    return this.control ? this.control.invalid : false;
  }

  public get showError(): boolean | any {
    if (!this.control) {
      return false;
    }
    const dirty = this.control.dirty;
    const touched = this.control.touched;

    return this.invalid ? touched : false;
  }
  public get errors(): Array<string> {
    if (!this.control) {
      return [];
    }

    const errors: any = this.control.errors;
    return Object.keys(errors).map((key) =>
      this.errorMessages.has(key)
        ? this.errorMessages.get(key)!()
        : <string>errors[key] || key
    );
  }

  public get valid(): boolean {
    return this.control ? this.control.valid : false;
  }

  public registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public writeValue(obj: any): void {
    // console.log(this.config);
    // this.dataModel[this.config.fieldKey] = obj;
  }

  public onChange() {
    this.onBlur.emit(this.dataModel[this.config.fieldKey]);
    this.onChangeFn(this.dataModel[this.config.fieldKey]);
  }

  public selectAutoCompleteOption(event: MatAutocompleteSelectedEvent) {
    if (!this.dataModel[this.config.fieldKey])
      this.dataModel[this.config.fieldKey] = [];
    this.dataModel[this.config.fieldKey] = event.option.value;
    this.onBlur.emit(this.dataModel[this.config.fieldKey]);

    // this.onBlur.emit(this.dataModel[this.config.fieldKey]);
    // this.onChangeFn(this.dataModel[this.config.fieldKey]);
  }

  public onDateSelected(event: any) {
    this.onDateChange.emit(this.dataModel[this.config.fieldKey]);
    // console.log(event, this.dataModel[this.config.fieldKey]);
  }

  togglePassword() {
    if (this.config.attributes.type == "password") {
      this.config.attributes.type = "text";
      this.showPassowrd = true;
    } else {
      this.config.attributes.type = "password";
      this.showPassowrd = false;
    }
  }
}

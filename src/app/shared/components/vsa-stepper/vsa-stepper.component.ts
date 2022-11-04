import { Component, Input, OnInit } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";

@Component({
  selector: "vsa-stepper",
  templateUrl: "./vsa-stepper.component.html",
  styleUrls: ["./vsa-stepper.component.scss"],
})
export class VSAStepperComponent implements OnInit {
  // Inputs
  @Input() steps: any[];
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ["", Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ["", Validators.required],
  });
  isLinear = false;

  constructor(private _formBuilder: FormBuilder) {
    this.steps = [
      {
        id: 1,
        label: "Company Details",
      },
      {
        id: 2,
        label: "Shipment Details",
      },
      {
        id: 3,
        label: "Rates",
      },
      {
        id: 4,
        label: "Bank Details",
      },
      {
        id: 5,
        label: "Preview",
      },
    ];
  }

  ngOnInit() {}
}

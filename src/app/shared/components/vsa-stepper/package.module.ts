import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { MaterialModule } from "../../shared-modules/material.module";
import { CommonModule } from "@angular/common";
import { VSATooltipModule } from "../vsa-tooltip";
import { VSAStepperComponent } from "./vsa-stepper.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  exports: [VSAStepperComponent],
  declarations: [VSAStepperComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    VSATooltipModule,
  ],
})
export class VSAStepperModule {}

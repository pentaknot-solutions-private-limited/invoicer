import { NgModule } from "@angular/core";
import { MaterialModule } from "../../shared-modules/material.module";
import { VSARadioComponent } from "./vsa-radio.component";
import { CommonModule } from "@angular/common";
import { VSATooltipModule } from "../vsa-tooltip";
import { FormsModule } from "@angular/forms";

@NgModule({
  exports: [VSARadioComponent],
  declarations: [VSARadioComponent],
  imports: [CommonModule, MaterialModule, FormsModule],
})
export class VSARadioModule {}

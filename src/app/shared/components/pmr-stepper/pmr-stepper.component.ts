import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatHorizontalStepper } from "@angular/material/stepper";
import { IPMRStepConfig, IPMRStepperConfig } from "./pmr-stepper.model";

@Component({
  selector: "pmr-stepper",
  templateUrl: "./pmr-stepper.component.html",
  styleUrls: ["./pmr-stepper.component.scss"],
})
export class PMRStepperComponent implements OnInit {
  // Parameters
  @Input() config: IPMRStepperConfig;
  @Input() stepsConfig: IPMRStepConfig[];
  @Input() stepIndex: number;
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  @Output() stepIndexChange: EventEmitter<number> = new EventEmitter();

  @ViewChild("stepper", { static: false }) stepper: MatHorizontalStepper;

  constructor() {
    // Initialize Default Properties
    this.stepIndex = 0;
  }

  ngOnInit() {}

  public nextStep() {
    this.stepper.next();
    this.stepIndex = this.stepper.selectedIndex;
    setTimeout(() => {
      this.stepIndexChange.emit(this.stepIndex);
    }, 100);
  }
  public prevStep() {
    this.stepper.previous();
    this.stepIndex = this.stepper.selectedIndex;
    setTimeout(() => {
      this.stepIndexChange.emit(this.stepIndex);
    }, 100);
  }

  public changeStep(event) {
    if (event.selectedIndex < event.previouslySelectedIndex) {
      this.stepper._steps.toArray()[event.previouslySelectedIndex].completed =
        false;
      // this.stepper._steps.toArray()[event.previouslySelectedIndex].editable = false;
    }
    if (event.selectedIndex > event.previouslySelectedIndex) {
      // this.stepper._steps.toArray()[event.previouslySelectedIndex].completed = true;
      // this.stepper._steps.toArray()[event.previouslySelectedIndex].editable = false;
      // this.userStepperForm._steps.toArray()[event.previouslySelectedIndex].completed = true;
    }
    this.stepIndex = this.stepper.selectedIndex;
    this.stepIndexChange.emit(this.stepIndex);
    // this.stepper._steps.toArray()[event.previouslySelectedIndex].interacted = false;
  }
}

import { StepState } from "@angular/cdk/stepper";
import { TemplateRef } from "@angular/core";
import { FormGroup } from "@angular/forms";

export interface IPMRStepperConfig {
    steps: IPMRStepConfig[];
}

export interface IPMRStepConfig {
    stepLabel: string;
    stepTemplate: TemplateRef<any>;
    isOptional?: boolean;
    isCompleted?: boolean;
    
    formGroup?: FormGroup;
}
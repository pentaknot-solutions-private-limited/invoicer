import { EventEmitter } from "@angular/core";

export interface IToggleAttribute {
  disable?: boolean;
  isMandatory?: boolean;
  label?: string;
  class?: string;
  color?: string;
}

export interface IToggleConfig {
  isActive?: boolean | number;
  attributes?: IToggleAttribute;
}

export interface IToggleEvents {
  onChange: EventEmitter<any>;
}

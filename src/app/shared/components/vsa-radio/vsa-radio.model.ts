export interface IRadioButtonConfig {
  fieldKey?: string | any;
  attributes: IRadioAttribute;
  options: IRadioOption[];
}

export interface IRadioOption {
  label?: string;
  value?: string | any;
  icon?: any; // Icon
  iconSize?: string;
}

export interface IRadioAttribute {
  label?: string;
  isMandatory?: boolean;
  disabled?: boolean;
  readonly?: boolean;
}

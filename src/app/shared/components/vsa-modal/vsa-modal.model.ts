
export class IVSAModalConfig {
  heading: string;
  size?: string;
  padding?: string;
  showExpand?: boolean;
  disableClose?: boolean;
  autoFocus?: boolean;
  height?: any;
  width?: any;
  footerActions?: IVSAModalFooterConfigAction[];
}

export class IVSAModalFooterConfigAction {
  value: string;
  type?: string;
  role?: string;
  customColor?: string;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  methodCallback?: string;
  // splitButtonConfig?: ISplitButtonConfig;
}

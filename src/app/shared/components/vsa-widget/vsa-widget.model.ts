import { TemplateRef } from "@angular/core";

export const defaultWidgetActions: IVSAWidgetAction[] = [
  {
    icon: "refresh",
    event: "refresh",
    tooltip: "Refresh",
  },
  {
    icon: "maximise",
    event: "maximise",
    tooltip: "Maximize",
  },
  {
    icon: "download",
    event: "download",
    tooltip: "Download",
  },
];

export interface ICustomChartConfig {
  customChartConfig?: {
    rawData: any[];
    filterVal?: any;
    viewType: "chart" | "grid";
    rawDataConverter: (data: any[], configData, filterVal?: any, overAllConfig?: IVSAWidgetConfig) => any;
  },
  type?: any;
  data?: any;
  options?: any;
  gridConfig?: any;
  gridRows?: any;
  dataConfig?: ICustomChartConfig;
}

export interface IVSAWidgetConfig {
  widgetId?: string | any;
  title?: string | any;
  exportTitle?: string | any;
  additionalActionTemplate?: TemplateRef<any> | any;
  // Actions
  actions?: IVSAWidgetAction[] | any;
  dataConfig?: ICustomChartConfig; // Chart Config
  breadcrumbs?: any[];
  maxLevel?: number;
  // Filters
  filterType?: "viewBy" | "template"; //sort |
  filterObject?: any;
  filterOptions?: any;
  selectedOption?: any;

  // Custom lengend
  customLegend?: string | any;
  customLegendTemplateRef?: TemplateRef<any>;
  // Grid
  showGrid?: boolean
  gridConfig?: any;
  gridRows?: any;
}

export interface IVSAWidgetAction {
  icon: string;
  event: string | any;
  isCallBack?: string | any | boolean;
  tooltip?: any;
}

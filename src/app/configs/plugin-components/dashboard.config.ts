import * as _ from "lodash";
import { ISelectConfig } from "src/app/shared/components/vsa-select-box/vsa-select-box.model";
import { IVSAWidgetConfig } from "src/app/shared/components/vsa-widget/vsa-widget.model";

export class DashboardConfigs {
  // By Contract Affiliate
  byAffiliateChartConfig: IVSAWidgetConfig = {
    title: "Affiliate",
    actions: false,
    breadcrumbs: [
      {
        title: "All",
        config: null,
        isActive: true,
      },
    ],
    maxLevel: 0,
    dataConfig: {
      customChartConfig: {
        viewType: "chart",
        rawData: [],
        rawDataConverter: (data, config, filterVal, overAllConfig) => {
          let chartLabel = [];
          let chartData = [];
          if (!data || data?.length == 0) {
            config["isEmpty"] = true;
          } else config["isEmpty"] = false;
          data?.forEach((element) => {
            chartLabel.push(element.type);
            chartData.push(element.value);
          });
          config.data.labels = chartLabel;
          config.data.datasets[0].data = chartData;
          return config;
        },
      },
      type: "pie",
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [...totalChartColor],
            borderColor: ["#ffffff"],
            borderWidth: 1,
            barThickness: 40,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          datalabels: {
            color: "white",
            align: "end",
          },
          legend: {
            position: "top",
          },
        },
      },
      //   Nested Table
      dataConfig: {
        customChartConfig: {
          viewType: "grid",
          rawDataConverter(data, config, filterVal, overAllConfig) {
            const filteredData = data.filter((item) => item.type == filterVal);
            config.gridConfig.rows = filteredData;
            return config;
          },
          rawData: [],
        },
        gridConfig: {
          rowId: "code",
          pagination: false,
          emptyMessage:
            "No data found.",
          gridHeightDelta: 339,
          colDefs: [
            {
              field: "type",
              headerName: "Type",
              colType: "text",
              width: '199px',
              customWidth: true
            },
            {
              field: "value",
              headerName: "Value",
              colType: "text",
              width: '199px',
              customWidth: true
            },
          ],
        },
      },
    },
  };

  // By Contract Affiliate
  byProductChartConfig: IVSAWidgetConfig = {
    title: "Products",
    actions: false,
    breadcrumbs: [
      {
        title: "All",
        config: null,
        isActive: true,
      },
    ],
    maxLevel: 0,
    dataConfig: {
      customChartConfig: {
        viewType: "chart",
        rawData: [],
        rawDataConverter: (data, config, filterVal, overAllConfig) => {
          let chartLabel = [];
          let chartData = [];
          if (!data || data?.length == 0) {
            config["isEmpty"] = true;
          } else config["isEmpty"] = false;
          data?.forEach((element) => {
            chartLabel.push(element.type);
            chartData.push(element.value);
          });
          config.data.labels = chartLabel;
          config.data.datasets[0].data = chartData;
          return config;
        },
      },
      type: "pie",
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [...totalChartColor],
            borderColor: ["#ffffff"],
            borderWidth: 1,
            barThickness: 40,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          datalabels: {
            color: "white",
            align: "end",
          },
          legend: {
            position: "top",
          },
        },
      },
      //   Nested Table
      dataConfig: {
        customChartConfig: {
          viewType: "grid",
          rawDataConverter(data, config, filterVal, overAllConfig) {
            const filteredData = data.filter((item) => item.type == filterVal);
            config.gridConfig.rows = filteredData;
            return config;
          },
          rawData: [],
        },
        gridConfig: {
          rowId: "code",
          pagination: false,
          emptyMessage:
            "No data found.",
          gridHeight:250,
          colDefs: [
            {
              field: "type",
              headerName: "Type",
              colType: "text",
              width: '199px',
              customWidth: true
            },
            {
              field: "value",
              headerName: "Value",
              colType: "text",
              width: '199px',
              customWidth: true
            },
          ],
        },
      },
    },
  };
  // By Contract Affiliate
  byClientTypeChartConfig: IVSAWidgetConfig = {
    title: "Client",
    actions: false,
    breadcrumbs: [
      {
        title: "All",
        config: null,
        isActive: true,
      },
    ],
    maxLevel: 0,
    dataConfig: {
      customChartConfig: {
        viewType: "chart",
        rawData: [],
        rawDataConverter: (data, config, filterVal, overAllConfig) => {
          let chartLabel = [];
          let chartData = [];
          if (!data || data?.length == 0) {
            config["isEmpty"] = true;
          } else config["isEmpty"] = false;
          data?.forEach((element) => {
            chartLabel.push(element.type);
            chartData.push(element.value);
          });
          config.data.labels = chartLabel;
          config.data.datasets[0].data = chartData;
          return config;
        },
      },
      type: "pie",
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [...totalChartColor],
            borderColor: ["#ffffff"],
            borderWidth: 1,
            barThickness: 40,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          datalabels: {
            color: "white",
            align: "end",
          },
          legend: {
            position: "top",
          },
        },
      },
      //   Nested Table
      dataConfig: {
        customChartConfig: {
          viewType: "grid",
          rawDataConverter(data, config, filterVal, overAllConfig) {
            const filteredData = data.filter((item) => item.type == filterVal);
            config.gridConfig.rows = filteredData;
            return config;
          },
          rawData: [],
        },
        gridConfig: {
          rowId: "code",
          pagination: false,
          emptyMessage:
            "No data found.",
          gridHeight:250,
          colDefs: [
            {
              field: "type",
              headerName: "Type",
              colType: "text",
              width: '199px',
              customWidth: true
            },
            {
              field: "value",
              headerName: "Value",
              colType: "text",
              width: '199px',
              customWidth: true
            },
          ],
        },
      },
    },
  };
}

export const totalChartColor = [
  "#4184fe",
  "#f45939",
  "#f7ab1d",
  "#4eb27d",
  "#41b8d8",
  "#6655bf",
  "#9644c8",
  "#c04366",
  "#98a0af",
];

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { ChartData, ChartOptions, ChartType, Chart } from "chart.js";
import * as _ from "lodash";
import { BaseChartDirective } from "ng2-charts";
import { IChartConfig } from "./vsa-chart.model";
import ChartDataLabels from 'chartjs-plugin-datalabels';
// borderColor: '#80d6d1',
// dotColor: '#55c5bc',
// backgroundColor: '#d9f2f0',
@Component({
  selector: "vsa-chart",
  templateUrl: "./vsa-chart.component.html",
  styleUrls: ["./vsa-chart.component.scss"],
})
export class VSAChartComponent implements OnInit {
  @Input() loading?: boolean;
  @Input() chartType: string;
  @Input() config: IChartConfig;
  @Input() customStyle: any;
  @Output() chartClicked: EventEmitter<any> = new EventEmitter();
  tempConfig: IChartConfig;
  @Input() data: any;
  @ViewChild("chartJsCanvas") chartJsCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild("chartJsExportCanvas") chartJsExportCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  pieInsideLabelPlugin;
  backgroundPlugin = {
    id: "custom_canvas_background_color",
    beforeDraw: (chart) => {
      const ctx = chart.canvas.getContext("2d");
      ctx.save();
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  };

  // Configuration
  // Doughnut >> Chart Starts
  public doughnutChartData: ChartData<"doughnut"> = {
    labels: ["Download Sales", "In-Store Sales"],
    datasets: [
      {
        data: [350, 450],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
      },
    ],
  };
  public chartOptions: ChartOptions = {
    plugins: {
      tooltip: {
        enabled: true,
      },
    },
  };
  public doughnutChartType: ChartType = "doughnut";
  get dataLabelPlugin() {
    return ChartDataLabels
  }
  constructor() {
    this.pieInsideLabelPlugin = {
      id: "doughnut-center-text",
      beforeDraw: (chart, args, options) => {
        if(chart.config.type == "doughnut")
        if(chart.config.options.plugins['doughnut-center-text']) {
          if(chart.config.options.plugins['doughnut-center-text'].callback) {
            chart.config.options.plugins['doughnut-center-text'].callback(chart, args, options)
          }
        }
      },
    }
  }

  ngOnInit(): void {
  }

  get percentage() {
    const total = Number(this.data[0]) + Number(this.data[1]);
    const triggered = (Number(this.data[0]) / total) * 100;
    const blocked = 100 - triggered;
    // const triggeredValue= triggered+'px';
    // const= triggered+'px';
    return { triggered, blocked };
  }

  ngOnChanges(e) {
  }

  public downloadCanvas(fileName) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("style", "display: none");
    const elementctx = this.chartJsExportCanvas.nativeElement;
    a.href = elementctx.toDataURL();
    a.download = `${fileName}.png`;
    a.click();
    a.remove();
  }

  // Update Chart
  updateChart() {
    if (this.chart) {
      this.chart.update();
      this.chart.chart.update();
      // console.log(this.config.data, this.config.options.plugins.title.text)
    }
  }

  onChartClick(e: any): void {
    // Emit Active Dataset
    this.chartClicked.emit(e.active[0]);
  }
}

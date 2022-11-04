import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { VSAChartComponent } from '../vsa-chart/vsa-chart.component';
import { VSAToastyService } from '../vsa-toasty/vsa-toasty/vsa-toasty.service';
import {
  defaultWidgetActions,
  IVSAWidgetAction,
  IVSAWidgetConfig,
} from './vsa-widget.model';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import { VSAGridComponent } from '../vsa-grid/vsa-grid.component';

@Component({
  selector: 'vsa-widget',
  templateUrl: './vsa-widget.component.html',
  styleUrls: ['./vsa-widget.component.scss'],
})
export class VSAWidgetComponent implements OnInit, OnChanges {
  // View Child
  @ViewChild('widgetChart') widgetChart: VSAChartComponent;
  @ViewChild('gridChart') gridChart: VSAGridComponent;
  @ViewChild('widgetElementRef') widgetElementRef: ElementRef<HTMLElement>;
  @ViewChild("grid") grid: VSAGridComponent;
  @ContentChild(TemplateRef) filterTemplaterRef: TemplateRef<any>;
  // Input
  @Input() config?: IVSAWidgetConfig;
  @Input() loading?: boolean;
  @Input() serviceObject?: Observable<any>;

  // Output Emitter
  @Output() filterChange: EventEmitter<any> = new EventEmitter();
  @Output() onChartClicked: EventEmitter<any> = new EventEmitter();
  @Output() onToggle: EventEmitter<any> = new EventEmitter();
  fullscreenView: boolean = false;
  // Variables
  overlayRef: OverlayRef;
  currentLevel = 0;
  tempStore = {
    config: null,
    gridDataConfig: null,
  };
  configsLoaded: number = 0;

  constructor(private toasty: VSAToastyService, private overlay: Overlay) {}

  ngOnInit(): void {
    if (Array.isArray(this.config.filterOptions)) {
      this.config.selectedOption = this.config.filterOptions[0];
    }
    this.actions()
  }

  ngOnChanges(e) {
    // Default Widget Actions
    this.assignActions();
    // this.recallAPI();
    if (e.serviceObject && this.serviceObject) {
      this.recallAPI();
    }
  }

  toggleBtn(id,buttonAction) {
    const event = {
      id : id,
      action: buttonAction
    }
    this.onToggle.emit(event);
  }

  actions() {
    this.config.actions = [
      {
        label: "Day",
        value: "day",
        checked: true,
        disabled: false,
      },
      {
        label: "Week",
        value: "week",
        checked: false,
        disabled: false,
      },
      {
        label: "Month",
        value: "month",
        checked: false,
        disabled: false,
      },
    ];
  }

  // Getter
  get chartConfig() {
    const dataConfig = this.accessConfigByIndex(this.currentLevel);
    let newConfig = null;
    if (dataConfig.customChartConfig) {
      newConfig = dataConfig.customChartConfig.rawDataConverter(
        dataConfig.customChartConfig.rawData,
        dataConfig,
        dataConfig.customChartConfig?.filterVal,
        this.config
      );
    } else {
      newConfig = dataConfig;
    }
    if (this.tempStore.config != newConfig) {
      if (
        dataConfig.customChartConfig &&
        newConfig.customChartConfig.viewType == 'chart'
      ) {
        this.refreshChart();
      }
      //  else if (
      //   dataConfig.customChartConfig &&
      //   newConfig.customChartConfig.viewType == "grid"
      // ) {
      //   this.tempStore.gridDataConfig = newConfig;
      //   if (this.fullscreenView) {
      //     newConfig.gridConfig.gridHeight = newConfig.gridConfig.gridFullHeight;
      //   } else {
      //     newConfig.gridConfig.gridHeight =
      //       newConfig.gridConfig.gridDefaultHeight;
      //   }
      //   console.log(newConfig)
      // }
      this.tempStore.config = null;
    }
    if (
      dataConfig.customChartConfig &&
      newConfig.customChartConfig.viewType == 'grid'
    ) {
      this.tempStore.gridDataConfig = newConfig;
      if (this.fullscreenView) {
        newConfig.gridConfig.gridHeight = newConfig.gridConfig.gridFullHeight;
      } else {
        newConfig.gridConfig.gridHeight =
          newConfig.gridConfig.gridDefaultHeight;
      }
    }
    this.tempStore.config = newConfig;
    // console.log(newConfig);

    return newConfig;
  }

  get dataConfig() {
    return this.accessConfigByIndex(this.currentLevel);
  }

  assignActions() {
    // Setup Maximize/ Minimise
    this.config.actions = defaultWidgetActions.map(
      (action: IVSAWidgetAction) => {
        let newAction: IVSAWidgetAction = action;
        if (action.event == 'maximise' || action.event == 'minimize') {
          newAction.event = this.fullscreenView ? 'minimize' : 'maximise';
          newAction.icon = this.fullscreenView ? 'minimize' : 'maximise';
          newAction.tooltip = this.fullscreenView ? 'Minimize' : 'Maximize';
        }
        return {
          ...newAction,
        };
      }
    );
  }

  accessConfigByIndex(level: number) {
    // let levelConfig = this.config.dataConfig;
    // for (let index = 1; index <= level; index++) {
    //   levelConfig = levelConfig.dataConfig;
    // }
    let levelConfig = null;
    switch (level) {
      case 0:
        levelConfig = this.config.dataConfig;
        break;
      case 1:
        levelConfig = this.config.dataConfig.dataConfig;
        break;
      case 2:
        levelConfig = this.config.dataConfig.dataConfig.dataConfig;
        break;
      case 3:
        levelConfig = this.config.dataConfig.dataConfig.dataConfig.dataConfig;
        break;
      case 4:
        levelConfig =
          this.config.dataConfig.dataConfig.dataConfig.dataConfig.dataConfig;
        break;

      default:
        break;
    }
    return levelConfig;
  }

  // Events
  actionClicked(type: string) {
    switch (type) {
      case 'refresh':
        // this.recallAPI();
        break;
      case 'maximise':
      case 'minimize':
        this.fullscreenView = !this.fullscreenView;
        this.toggleFullScreen();
        this.assignActions();
        break;
      case 'download':
        this.downloaChart();
        break;

      default:
        break;
    }
  }

  toggleFullScreen() {
    if (this.fullscreenView) {
      this.overlayRef = this.overlay.create();
      const userProfilePortal = new DomPortal(this.widgetElementRef);
      this.overlayRef.attach(userProfilePortal);
    } else {
      this.overlayRef.detach();
    }
    setTimeout(() => {
      if (this.gridChart) {
        // this.gridChart.fitRows()
      }
    }, 100);
  }

  selectionChange(type: string, event: any) {
    // this.clearChart();
    event['type'] = type;
    switch (type) {
      case 'viewBy':
        this.config.selectedOption = event;
        this.filterChange.emit(event);
        break;

      default:
        break;
    }
    setTimeout(() => {
      this.refreshChart();
    }, 10);
  }

  // Chart Events
  onChartClick(event: any) {
    const oldConfig = this.accessConfigByIndex(this.currentLevel);
    if (
      this.currentLevel < this.config.maxLevel &&
      event.index != undefined &&
      event.index != null &&
      event.datasetIndex != undefined &&
      event.datasetIndex != null
    ) {
      const clickedData = {
        data: oldConfig.data.datasets[event.datasetIndex].data[event.index],
        label: null,
        context: this,
      };
      if (oldConfig.data.labels && oldConfig.data.labels.length > 0) {
        clickedData.label = oldConfig.data.labels[event.index];
      }
      if (!clickedData.label) {
        clickedData.label = clickedData.data.label;
      }
      this.config.breadcrumbs[this.currentLevel].isActive = false;
      this.config.breadcrumbs[this.currentLevel]['config'] = _.cloneDeep(
        this.chartConfig
      );
      this.config.breadcrumbs.push({
        title: clickedData.label,
        isActive: true,
        config: null,
      });
      this.currentLevel += 1;
      if (
        this.accessConfigByIndex(this.currentLevel).customChartConfig.rawData
      ) {
        this.accessConfigByIndex(
          this.currentLevel
        ).customChartConfig.filterVal = clickedData.label;
        console.log(clickedData);
        this.accessConfigByIndex(this.currentLevel).customChartConfig.rawData =
          this.config.dataConfig.customChartConfig.rawData;
      }
      console.log(this.chartConfig);
      this.onChartClicked.emit(clickedData);
    }
  }

  gotoView(level: number) {
    this.currentLevel = level;
    switch (level) {
      case 0:
        this.config.dataConfig = this.config.breadcrumbs[level].config;
        break;
      case 1:
        this.config.dataConfig.dataConfig =
          this.config.breadcrumbs[level].config;
        break;
      case 2:
        this.config.dataConfig.dataConfig.dataConfig =
          this.config.breadcrumbs[level].config;
        break;
      case 3:
        this.config.dataConfig.dataConfig.dataConfig.dataConfig =
          this.config.breadcrumbs[level].config;
        break;
      case 4:
        this.config.dataConfig.dataConfig.dataConfig.dataConfig.dataConfig =
          this.config.breadcrumbs[level].config;
        break;

      default:
        break;
    }
    this.config.breadcrumbs[level].isActive = true;
    this.config.breadcrumbs.splice(level + 1);
  }

  refreshChart() {
    if (this.widgetChart) {
      setTimeout(() => {
        this.widgetChart.updateChart();
      }, 100);
    }
  }

  downloaChart() {
    if (!this.gridChart) {
      this.widgetChart.downloadCanvas(
        this.config.exportTitle || this.config.title || 'Title'
      );
    } else {
      // this.gridChart.gridHeader.download({ fileName: "export" });
    }
  }

  // APICall
  recallAPI() {
    if (this.serviceObject) {
      this.loading = true;
      this.serviceObject.subscribe((res) => {
        if (res.error) {
          this.toasty.error(res.message);
        } else {
          this.configsLoaded = 0;
          if (this.config.breadcrumbs) {
            if(this.currentLevel != 0) {
              this.gotoView(0);
            }
          } else {
            this.currentLevel = 0;
          }
          this.config.dataConfig.customChartConfig.rawData = res;
          setTimeout(() => {
            this.refreshChart();
          }, 10);
        }
        this.loading = false;
      });
    }
  }
}

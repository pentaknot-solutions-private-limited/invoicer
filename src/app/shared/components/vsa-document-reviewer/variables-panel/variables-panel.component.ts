import { BreakpointObserver } from '@angular/cdk/layout';
import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { MatSidenav } from '@angular/material/sidenav';
import * as _ from 'lodash';

@Component({
  selector: 'variables-panel',
  templateUrl: './variables-panel.component.html',
  styleUrls: ['./variables-panel.component.scss'],
})
export class VariablesPanelComponent implements OnInit, OnChanges {
  // Params
  @Input('docVariablesList') variableList: any[];
  @Output()
  onVariableSelectionChange: // emit variableId and deviceId onSelectionChange
  EventEmitter<{ variableId: number | string; deviceId: number | string; variableIndex: number }> =
    new EventEmitter();

  // Variables
  collapse: boolean = false;
  active: boolean = false;
  currentSelectedVariableId: number | string;
  currentSelectedDeviceId: number | string;

  // Getter / Setter
  get currentVariableIndex() {
    // get variableIndex based on current stored variable Id.
    if (this.variableList && this.variableList.length > 0) {
      return (
        this.variableList.findIndex(
          (variable) => variable.id == this.currentSelectedVariableId
        ) + 1
      );
      // Added index with 1 because,
      // Representation of Index on UI should start from 1 instead of 0.
    }
    return 0;
  }

  set currentVariableIndex(index: number) {
    // Set Selected VariableId based on input index
    if (index != undefined && index >= 1 && index <= this.variableList.length)
      this.currentSelectedVariableId = this.variableList[index - 1].id;

    // current variableIndex cannot be more than variables length.
    if (index > this.variableList.length) {
      this.currentVariableIndex = this.variableList.length;
    }

    // current variableIndex cannot be less than 1 if there is atleast 1 variable.
    if (index < 1 && this.variableList && this.variableList.length > 0) {
      this.currentVariableIndex = 1;
    }
  }

  get remainingVariables() {
    return this.getNumberOfRemainingVariables()
  }

  constructor(private breakPointObs: BreakpointObserver) {}

  ngOnInit(): void {
    this.responsiveHeader();
     
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.variableList &&
      this.variableList &&
      this.variableList.length > 0
    ) {
      this.getCurrentNotCompletedVariable(this.variableList);
    }
  }

  onCollapse() {
    this.collapse = !this.collapse;
  }

  isActiveVar(variableId: number | string) {
    return this.currentSelectedVariableId == variableId;
  }

  isCompletedVar(variableId: number | string) {
    let isCompleted = true;
    this.variableList
      .find((variable) => variable.id == variableId)
      .devices.forEach((device) => {
        if (device.status == 0) isCompleted = false;
      });
    return isCompleted;
  }

  // To display out of devices, how many devices are completed
  getNumberOfCompletedStatusCount(deviceData: any, variableData?: any) {
    // Here we will get the count of how many devices are completed
    const count = deviceData.filter((row: any) => row.status == 1).length;
    return count;
  }

  getNumberOfRemainingVariables() {
    let remainingVariables = []
    this.variableList.forEach(element => {
      const data = element.devices.filter((row: any) => row.status == 0)
      if (data.length > 0) {
        remainingVariables.push(data)
      }
    });
    return remainingVariables.length;
  }

  // This function is used to check which variable is incomplete and set it as active
  getCurrentNotCompletedVariable(variableList: any) {
    let notCompletedVariable;
    // We will iterate the complete variable list
    for (let index = 0; index < variableList.length; index++) {
      const element = variableList[index];
      // In status variable we will store the status of each variable
      const status = this.isCompletedVar(element.id);
      // Whose status is not complete, we will take the first element and store it in notCompletedVariable
      if (!status) {
        notCompletedVariable = variableList[index];
        break;
      }
    }
    // If we have notCompletedVariable then we will store its indexNumber, variableId & DeviceId
    if (notCompletedVariable) {
      const activeDataIndex =
        variableList.findIndex(
          (variable) => variable.id == notCompletedVariable.id
        ) + 1;
      this.currentVariableIndex = activeDataIndex;
      this.currentSelectedVariableId = notCompletedVariable.id;
      this.currentSelectedDeviceId = notCompletedVariable.devices[0].deviceId; // Here we have took the first device from devices(Device Group List) which is intially default
      this.setVariableData(this.currentSelectedVariableId,this.currentSelectedDeviceId, activeDataIndex);
    } else {
      // if there is no notCompletedVariable then we will set the 1st variable as active
      this.currentVariableIndex = 1;
      this.currentSelectedDeviceId =
        variableList[this.currentVariableIndex].devices[0].deviceId;
        this.setVariableData(this.currentSelectedVariableId,this.currentSelectedDeviceId);
    }
  }

  // When we select/click on variable
  onVariableItemSelect(data: any, device?: any) {
    // If Device parameter is passed take it drom that or else take from 0th index device.
    this.setVariableData(data.id, device ? device.deviceId : data.devices[0].deviceId);
  }


  onVarIndexIncreament() {
    this.setVariableData(
      this.variableList[this.currentVariableIndex].id,
      this.variableList[this.currentVariableIndex].devices[0].deviceId,
      this.currentVariableIndex
    );
  }

  onVarIndexDecreament() {
    this.setVariableData(
      this.variableList[this.currentVariableIndex - 2].id,
      this.variableList[this.currentVariableIndex - 2].devices[0].deviceId,
      this.currentVariableIndex - 2
    );
  }

  // When we enter number inside the input box this function is called
  onVariableIndexChange() {
    this.onVariableSelectionChange.emit({
      deviceId: this.currentSelectedDeviceId,
      variableId: this.currentSelectedVariableId,
      variableIndex: this.currentVariableIndex
    });
  }

  onDeviceGroupChange(data: any) {
    this.currentSelectedDeviceId = data.deviceId; // Set the selected device
    this.onVariableSelectionChange.emit({
      deviceId: this.currentSelectedDeviceId,
      variableId: this.currentSelectedVariableId,
      variableIndex: this.currentVariableIndex
    });
  }

  setVariableData(variableId?: any, deviceId?: any, indexNumber?: any) {
    this.currentSelectedVariableId = variableId;
    this.currentSelectedDeviceId = deviceId; // Here we will take the first device from devices(Device Group List) which is intially default
    this.isActiveVar(this.currentSelectedVariableId); // Using this 'isActiveVar' function we will make this variable as selected and active

    // Once we have the currentSelectedVariableId & currentSelectedDeviceId we will emit it so that we can use it in right panel
    this.onVariableSelectionChange.emit({
      deviceId: this.currentSelectedDeviceId,
      variableId: this.currentSelectedVariableId,
      variableIndex: this.currentVariableIndex
    });
  }

  responsiveHeader() {
    const queries = ['(max-width: 1200px)'];
    this.breakPointObs.observe(queries).subscribe((response) => {
      for (const query of Object.keys(response.breakpoints)) {
        if (response.breakpoints[queries[0]]) {
          this.collapse = true;
        } else {
          this.collapse = false;
        }
      }
    });
  }
}

import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import { IVSASelectionListConfig } from './vsa-selection-list.model';

@Component({
    selector: 'vsa-selection-list',
    templateUrl: './vsa-selection-list.component.html',
    styleUrls: ['./vsa-selection-list.component.scss']
})
export class VSASelectionListComponent {

    // Params
    @Input() config: IVSASelectionListConfig;
    @Input() listOptions: any[];
    @Input() selectedItems = []
    @Output() selectedItemsChange: EventEmitter<any[]> = new EventEmitter();

    // Variables
    internalModel = {
        search: null,
        showToggle: false
    }
    preservedSelectedList = [];
    get filteredList() {
        return !this.internalModel.search ? 
        ( 
          this.internalModel.showToggle ? 
          this.listOptions.filter(item => this.selectedItems.includes(item[this.config.returnKey || this.config.labelKey])) :
          this.listOptions
        ) : 
        this.filterByValue(
            (this.internalModel.showToggle ? 
            this.listOptions.filter(item => this.selectedItems.includes(item[this.config.returnKey || this.config.labelKey])) :
            this.listOptions)
        ,this.internalModel.search)
    }

    // Configs
    internalConfig = {
        search: {
            fieldKey: "search",
            attributes: {
              isSmall: true,
              placeholder: "Search ",
              isMandatory: false,
              prefixIcon: "search",
              iconSize: "small",
              class: "center",
            }
        },
        showSelectedToggle: {
            isActive: this.internalModel.showToggle,
            attributes: {
              disable: false,
              label: `Show Selected`,
            },
        }
    }

    constructor() {

    }

    isItemSelect(option) {
        // console.log(this.selectedItems, option)
        return this.selectedItems.includes(option)
    }
    
    setAll(checked) {
        if(checked) {
            this.selectedItems = _.clone(this.listOptions.map(item => item[this.config.returnKey || this.config.labelKey]))
        } else {
            this.selectedItems = []
        }
        if(this.selectedItems.length == 0) {
            this.internalModel.showToggle = false
            this.internalConfig.showSelectedToggle.isActive = false
        }
        this.selectedItemsChange.emit(this.selectedItems)
    }

    selectItem(event) {
        if(event.option.selected) {
            this.selectedItems.push(event.option.value)
        } else {
            const removeIndex = this.selectedItems.findIndex(item => item == event.option.value);
            if(removeIndex != undefined)
            this.selectedItems.splice(removeIndex, 1);
        }
        if(this.selectedItems.length == 0) {
            this.internalModel.showToggle = false
            this.internalConfig.showSelectedToggle.isActive = false
        }
        this.selectedItemsChange.emit(this.selectedItems)
    }

    filter(event) {
        // this.selectedItems = _.clone(this.preservedSelectedList)
    }

    filterByValue(array, string) {
        return array.filter(o =>
            Object.keys(o).some(k => o[k].toLowerCase().includes(string.toLowerCase())));
    }

    toggleShowSelected(event) {
        this.internalModel.showToggle = event.isActive;
    }
}

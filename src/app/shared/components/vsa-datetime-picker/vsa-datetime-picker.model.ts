import { EventEmitter } from '@angular/core';

// export interface IRules {
//     rule: string;
//     message: string;
// }

// export interface IDateAttribute {
//     label?:string;
//     type?:string;
//     placeholder?:string;
//     matlabel?:string;
//     disable?:boolean;
//     isMandatory?:boolean;
//     appearance?:string;
//     prefixIcon?:string;
//     prefixIconImg?:string;
//     suffixIcon?:string;
//     class?:string;
//     minDate?: Date;
//     maxDate?: Date;
// }

// export interface IDateTimeConfig {
//     fieldKey:string;
//     attributes?:IDateAttribute;
//     picker?: IPickerConfig;
//     api?:any;
// }
export interface IDateTimeConfig {
    // value: string | number;
    disabled?: boolean;
    pickerType?: string; // both, calendar, timer
    selectMode?: string; // single, range, rangeFrom, rangeTo
    hour12Timer?: boolean;
}

//Methods & EventEmitters
export interface IDateTimeEvents {
    onChange: EventEmitter<any>;
}
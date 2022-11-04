import { TemplateRef } from "@angular/core";

export interface ISelectAttribute {
    type?: string;
    label?:string;
    readonly?: boolean;
    placeholder?:string;
    matlabel?:string;
    disable?:boolean;
    inputClass?:string;
    isMandatory?:boolean;
    appearance?:string;
    prefixIcon?:string;
    prefixIconImg?:string;
    suffixIcon?:string;
    class?:string;
    hint?: string;
    rowSize?: "single" | "double" | "triple";
    title?: string;
    showBorder?: false
}

export interface ISelectConfig {
    fieldKey:string;
    returnKey?: string;
    dataKey?:string;
    options: any[];
    isMultiple?: boolean;
    attributes?:ISelectAttribute;
    api?:any;
    searchBy?: ISelectSearchBy[];
    tooltipKey?: string;
    disableBoolKey?: string;
    isLazyLoaded?: boolean;
}

export interface ISelectSearchBy {
    key?: string;
    class?: string;
}
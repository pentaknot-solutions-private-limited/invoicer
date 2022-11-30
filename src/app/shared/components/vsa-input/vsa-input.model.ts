export interface IRules {
    rule: string;
    message: string;
}

export interface ITextAttribute {
    label?: string;
    type?: string;
    max?: number;
    placeholder?: string;
    matlabel?: string;
    disable?: boolean;
    readonly?: boolean;
    inputClass?: string;
    isMandatory?: boolean;
    validateOninit?: boolean;
    appearance?: string;
    iconSize?: string;
    prefixIcon?: string;
    prefixIconImg?: string;
    suffixIcon?: string;
    togglePassword?: boolean;
    isOptional?: boolean;
    pattern?: RegExp | string;
    minDate?: any;
    maxDate?: any;
    isSmall?: boolean;
    customPatternMessage?: string;
    class?: string;
    hint?: string;
    disableNativeAutoComplete?: boolean;
    // Auto Complete Recipient Selector
    prefixText?: string;
    autoCompleteOptions?: any[];
    title?: string | any;
    errorMessage?: string;
    showBorder?: boolean;
    autoComplete?: boolean;
}


export interface ITextConfig {
    fieldKey: string;
    attributes: ITextAttribute;
    pickerConfig?: any;
    api?: any;
    disableBoolKey?: string,
}
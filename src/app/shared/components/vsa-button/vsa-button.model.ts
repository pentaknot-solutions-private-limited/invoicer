export interface ISplitButtonConfig {
    disableSplitBtn: boolean;
    splitBtnItem: IVSAButtonActionItemConfig[]
}

export interface IVSAButtonActionItemConfig {
    name: string;
    value?: any;
    disabled?: boolean;
    icon?: string;
    isSeprator?: boolean;
    iconColor?: string;
    child?:IVSAButtonActionItemConfig[]
}
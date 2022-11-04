# VSA Button Component

> Custom Button Component created for VSA Project.

It includes functionalities such as:
1. Prefix Icon.
2. 2 Different Sizes:
   - Default - height 34px
   - Small - height 28px
3. 4 Variants / Roles:
   - Primary - with theme matching background color
   - Secondary - with theme matching border color
   - Teritiary - gray border color
   - Custom - use custom border color
4. 3 Types:
   - Button - Act as a normal button.
   - Submit - Act as a submit button inside form container.
   - Reset - Reset the form.
5. Split Button.
6. Disable / Enable State.

## Configurations:

1. Input [Property Binding] Parameters:
   - size: "default" | "small". Default value is "default".
   - type: "reset" | "submit" | "button". Default value is "button".
   - role: "primary" | "secondary" | "tertiary" | "custom". Default value is "primary".
   - customColor: null | "#ColorCode". Default value is null. Works only with role: custom.
   - icon: null | "icon_name". Default value is null.
   - disabled: true | false. Default value is false.
   - SplitConfig: null | ISplitButtonConfig. Default value is null.

2. Output (Event Emiters) Parameters:
   - onClick: Emit Event when user click on button.
   - onSplitActionClick: Emit Event when user user click on split button action.


## Model's:

- Class ISplitButtonConfig 
```
ISplitButtonConfig: {
    disableSplitBtn: boolean;
    splitBtnItem: ISplitButtonItemConfig[]
}
```
- Class ISplitButtonItemConfig 
```
ISplitButtonConfig: {
    name: string;
    icon?: string;
    isSeprator?: boolean;
}
```
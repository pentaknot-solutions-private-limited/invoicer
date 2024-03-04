import { ITextConfig } from "src/app/shared/components/vsa-input/vsa-input.model"

export const LoginIdInput: ITextConfig = {
    fieldKey: 'emailId',
    attributes: {
        placeholder: 'Email Address',
        isMandatory: true,
        title: "Email Address",
        // pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        // customPatternMessage: 'Please enter a valid email address.',
        showBorder: false
    }
}
export const LoginPasswordInput: ITextConfig = {
    fieldKey: 'password',
    attributes: {
        placeholder: 'Type your password',
        isMandatory: true,
        type: 'password',
        togglePassword: true,
        title: "Password",
        showBorder: false
    }
}

export const FirstNameInput: ITextConfig = {
    fieldKey: 'firstName',
    attributes: {
        placeholder: 'First Name',
        isMandatory: true,
        title: "First Name",
        readonly: true,
        showBorder: false
    }
}

export const LastNameInput: ITextConfig = {
    fieldKey: 'lastName',
    attributes: {
        placeholder: 'Last Name',
        isMandatory: true,
        title: "Last Name",
        readonly: true,
        showBorder: false
    }
}

export const EmailIdInput: ITextConfig = {
    fieldKey: 'emailId',
    attributes: {
        placeholder: 'Email Address',
        isMandatory: true,
        title: "Email Address",
        readonly: true,
        showBorder: false
    }
}

export const TemporaryPasswordInput: ITextConfig = {
    fieldKey: 'tempPassword',
    attributes: {
        placeholder: 'Temporary Password',
        isMandatory: true,
        type: 'password',
        togglePassword: true,
        title: "Temporary Password",
        showBorder: false
    }
}

export const NewPasswordInput: ITextConfig = {
    fieldKey: 'newPassword',
    attributes: {
        placeholder: 'Type your password',
        isMandatory: true,
        type: 'password',
        togglePassword: true,
        title: "New Password",
        showBorder: false
    }
}

export const ConfirmNewPasswordInput: ITextConfig = {
    fieldKey: 'confirmNewPassword',
    attributes: {
        placeholder: 'Confirm your Password',
        isMandatory: true,
        type: 'password',
        togglePassword: true,
        title: "Confirm New Password",
        showBorder: false
    }
}
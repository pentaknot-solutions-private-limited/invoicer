import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { VSAToastyModule } from "src/app/shared/components/vsa-toasty/vsa-toasty/package.module";
import { VSAButtonModule } from "src/app/shared/components/vsa-button/package.module";
import { VSAInputModule } from "src/app/shared/components/vsa-input/package.module";
import { ToastContainerModule } from "src/app/shared/components/vsa-toasty/vsa-toasty/vsa-toasty.directive";
import { LoginService } from "src/app/shared/_http/login.service";
import { ConfirmTemporaryPasswordComponent } from './confirm-temporary-password/confirm-temporary-password.component';
import { CreateNewPasswordComponent } from './create-new-password/create-new-password.component';
import { VSAIconModule } from "src/app/shared/components/vsa-icon/package.module";

@NgModule({
    imports: [ 
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        VSAInputModule,
        VSAButtonModule,
        VSAIconModule,
        VSAToastyModule.forRoot(),
        ToastContainerModule,
        RouterModule.forChild([
            {path: '', redirectTo: '/auth/login', pathMatch: 'full'},
            {path: 'login', component: LoginComponent},
            {path: 'confirm-temporary-password', redirectTo: '/auth/create-new-password', component: CreateNewPasswordComponent},
            {path: 'create-new-password', component: CreateNewPasswordComponent},
        ])
    ],
    declarations: [ LoginComponent, ConfirmTemporaryPasswordComponent, CreateNewPasswordComponent ],
    providers: [LoginService]
})

export class LoginModule {
    constructor(){ }
 }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VSAButtonModule } from 'src/app/shared/components/vsa-button/package.module';
import { VSAGridModule } from 'src/app/shared/components/vsa-grid/package.module';
import { VSAIconModule } from 'src/app/shared/components/vsa-icon/package.module';
import { VSAInputModule } from 'src/app/shared/components/vsa-input/package.module';
import { VSAModalModule } from 'src/app/shared/components/vsa-modal/package.module';
import { VSANotificationModule } from 'src/app/shared/components/vsa-notifications/package.module';
import { VSASelectBoxModule } from 'src/app/shared/components/vsa-select-box/package.module';
import { VSAToastyModule } from 'src/app/shared/components/vsa-toasty/vsa-toasty/package.module';
import { VSAWidgetModule } from 'src/app/shared/components/vsa-widget/package.module';
import { MaterialModule } from 'src/app/shared/shared-modules/material.module';
import { WipComponent } from './wip.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VSAModalModule,
    VSANotificationModule,
    VSAIconModule,
    VSAButtonModule,
    VSAInputModule,
    VSASelectBoxModule,
    VSAGridModule,
    MaterialModule,
    VSAWidgetModule,
    VSAToastyModule.forRoot(),
    RouterModule.forChild([
      {
        path: '',
        component: WipComponent,
        pathMatch: 'full',
      },
      {
        path: 'wip',
        component: WipComponent,
      },
    ]),
  ],
  declarations: [
    WipComponent,
  ],
  providers:[]
})
export class WipModule { }

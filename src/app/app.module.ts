import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./shared/shared-modules/material.module";
import { AuthLayoutComponent } from "./core/layouts/AuthLayout/authlayout.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { VSALoaderModule } from "./shared/components/vsa-loader/package.module";
import { EmptyLayoutComponent } from "./core/layouts/EmptyLayout/empty-layout.component";
import { AuthRouteGuard } from "./shared/guard/auth-route.guard";
import { LoginRouteGuard } from "./shared/guard/login-route.guard";
import { NavigationLayoutComponent } from "./core/layouts/NavigationLayout/navigation-layout.component";
import { Toast } from "./shared/components/vsa-toasty/vsa-toasty/vsa-toasty.component";
import { VSAIconModule } from "./shared/components/vsa-icon/package.module";
import { VSADrawerPanelModule } from "./shared/components/vsa-drawer-panel/src/package.module";
import { VSAToastyModule } from "./shared/components/vsa-toasty/vsa-toasty/package.module";
import { WipComponent } from "./modules/wip/wip.component";
import { NotificationsComponent } from "./core/layouts/NavigationLayout/common/notifications/notifications.component";
import { SettingsComponent } from "./core/layouts/NavigationLayout/common/settings/settings.component";
import { ProfileComponent } from "./core/layouts/NavigationLayout/common/profile/profile.component";
import { VSAButtonModule } from "./shared/components/vsa-button/package.module";
import {
  initConfig,
  AppConfig,
} from "./shared/_global/environment-config.service";
import { AuthTokenInterceptor } from "./shared/interceptors/auth.interceptor";
import { VSANotificationModule } from "./shared/components/vsa-notifications/package.module";

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    EmptyLayoutComponent,
    NavigationLayoutComponent,
    EmptyLayoutComponent,
    NotificationsComponent,
    SettingsComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    VSALoaderModule,
    VSAIconModule,
    VSAButtonModule,
    VSADrawerPanelModule,
    VSAToastyModule.forRoot(),
  ],
  providers: [
    AuthRouteGuard,
    LoginRouteGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfig],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [Toast],
})
export class AppModule {}

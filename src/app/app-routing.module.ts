import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthLayoutComponent } from "./core/layouts/AuthLayout/authlayout.component";
import { NavigationLayoutComponent } from "./core/layouts/NavigationLayout/navigation-layout.component";
import { AuthRouteGuard } from "./shared/guard/auth-route.guard";
import { LoginRouteGuard } from "./shared/guard/login-route.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "/auth/login",
    pathMatch: "full",
  },
  {
    path: "auth",
    component: AuthLayoutComponent,
    canActivate: [LoginRouteGuard],
    loadChildren: () =>
      import("./modules/login/login.module").then((m) => m.LoginModule),
  },
  {
    path: "wip",
    component: NavigationLayoutComponent,
    canActivate: [AuthRouteGuard],
    loadChildren: () =>
      import("./modules/wip/wip.module").then((m) => m.WipModule),
  },
  {
    path: "invoices",
    component: NavigationLayoutComponent,
    canActivate: [AuthRouteGuard],
    loadChildren: () =>
      import("./modules/invoices/invoices.module").then(
        (m) => m.InvoicesModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

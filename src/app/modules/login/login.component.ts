import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { map, mergeMap, retry } from "rxjs/operators";
import { IResponseSchema } from "src/app/configs/api-config";
import { GlobalConfig } from "src/app/configs/global-config";
import { ToastContainerDirective } from "src/app/shared/components/vsa-toasty/vsa-toasty/vsa-toasty.directive";
import { VSAToastyService } from "src/app/shared/components/vsa-toasty/vsa-toasty/vsa-toasty.service";
import { EncryptedStorage } from "src/app/shared/utils/encrypted-storage";
import { LoginService } from "src/app/shared/_http/login.service";

//Config Imports
import {
  LoginIdInput,
  LoginPasswordInput,
} from "../../configs/plugin-components/login-form.config";
import { LoginModel } from "./login.model";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  providers: [VSAToastyService],
})
export class LoginComponent implements OnInit {
  isLoading?: boolean;
  // Template Ref
  @ViewChild(ToastContainerDirective, { static: true })
  toastContainer?: ToastContainerDirective;

  // Configs
  loginForm: FormGroup = new FormGroup({
    emailId: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
  });
  public loginInputConfig = {
    LoginIdInput,
    LoginPasswordInput,
  };
  toastyConfig: any;

  // Models
  loginModel: LoginModel = new LoginModel();
  loginCredentials: any[] = [];

  constructor(
    private loginService: LoginService,
    private router: Router,
    private toasty: VSAToastyService
  ) {
    this.loginInputConfig.LoginIdInput.attributes.disable = this.isLoading;
    this.loginInputConfig.LoginPasswordInput.attributes.disable =
      this.isLoading;
  }

  ngOnInit() {
    new EncryptedStorage().clearAll();
    this.setupToasty();
    this.loginDetails();
  }

  setupToasty() {
    this.toasty.overlayContainer = this.toastContainer;
    this.toasty.toastyConfig.preventDuplicates = true;
  }

  onSubmit() {
    // Submit login
    this.isLoading = true;
    this.loginService
      .login(this.loginModel, this.loginCredentials)
      .subscribe((res: IResponseSchema) => {
        if (res.error) {
          this.toasty.error(res.message);
          this.isLoading = false;
        } else {
          this.toasty.success(res.message);
          // this.router.navigate(['/dashboard']);
          // this.router.navigate(['/invoices']);
          this.router.navigate([new GlobalConfig().dashboardRoute]);

          this.isLoading = false;
        }

        // Reset Form
      });
  }

  loginDetails() {
    this.loginService.loginDetails().subscribe((res: any) => {
      this.loginCredentials = res;
    });
  }
}

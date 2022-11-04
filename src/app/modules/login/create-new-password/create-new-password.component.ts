import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FirstNameInput,
  LastNameInput,
  EmailIdInput,
  TemporaryPasswordInput,
  NewPasswordInput,
  ConfirmNewPasswordInput
} from 'src/app/configs/plugin-components/login-form.config';
import { ToastContainerDirective } from 'src/app/shared/components/vsa-toasty/vsa-toasty/vsa-toasty.directive';
import { VSAToastyService } from 'src/app/shared/components/vsa-toasty/vsa-toasty/vsa-toasty.service';
import { EncryptedStorage } from 'src/app/shared/utils/encrypted-storage';
import { LoginService } from 'src/app/shared/_http/login.service';
import { CNewPasswordModel, CTemporaryPasswordModel } from '../login.model';
import * as crypto from 'crypto-js';
@Component({
  selector: 'app-create-new-password',
  templateUrl: './create-new-password.component.html',
  styleUrls: ['./create-new-password.component.scss'],
  providers: [VSAToastyService],
})
export class CreateNewPasswordComponent implements OnInit {
  isLoading?: boolean;
  // Template Ref
  @ViewChild(ToastContainerDirective, { static: true })
  toastContainer?: ToastContainerDirective;

  // Configs
  loginForm: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    emailId: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    confirmNewPassword: new FormControl('', Validators.required),
  });

  tempPasswordForm: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    emailId: new FormControl('', Validators.required),
    tempPassword: new FormControl('', Validators.required),
  });
  public loginInputConfig = {
    FirstNameInput,
    LastNameInput,
    EmailIdInput,
    TemporaryPasswordInput,
    NewPasswordInput,
    ConfirmNewPasswordInput
  };
  toastyConfig: any;

  // Models
  cNewPassword: CNewPasswordModel = new CNewPasswordModel();
  cTemporaryPassword: CTemporaryPasswordModel = new CTemporaryPasswordModel();

  // variables
  showCreatePassword: boolean = false;
  tempPassword = "Abc123"

  constructor(
    private loginService: LoginService,
    private router: Router,
    private toasty: VSAToastyService,
    private activatedRoute: ActivatedRoute
  ) {
    this.loginInputConfig.FirstNameInput.attributes.disable = true;
    this.loginInputConfig.LastNameInput.attributes.disable = true;
    this.loginInputConfig.EmailIdInput.attributes.disable = true;
    this.cNewPassword.firstName = this.cTemporaryPassword.firstName = activatedRoute.snapshot.queryParamMap.get("fname") || "Not Found";
    this.cNewPassword.lastName = this.cTemporaryPassword.lastName = activatedRoute.snapshot.queryParamMap.get("lname") || "Not Found";
    this.cNewPassword.emailId = this.cTemporaryPassword.emailId = activatedRoute.snapshot.queryParamMap.get("email") || "Not Found";
    // const encrypt = this.loginService.encrypt(this.tempPassword)
    // this.router.navigate([], {
    //   queryParams: { token: encrypt },
    //   queryParamsHandling: "merge",
    //   replaceUrl: true,
    // });
    
  }

  ngOnInit() {
    
    // this.cTemporaryPassword.firstName = "Sharon"
    // this.cTemporaryPassword.lastName = "Price"
    // this.cTemporaryPassword.emailId = "sharon.price@its.jnj.com"
    new EncryptedStorage().clearAll();
    this.setupToasty();
  }

  setupToasty() {
    this.toasty.overlayContainer = this.toastContainer;
    this.toasty.toastyConfig.preventDuplicates = true;
  }

  onTemporaryPasswordSubmit() {
    // Temporary Password Submit
    console.log(this.cTemporaryPassword);
    this.isLoading = true;
    setTimeout(() => {
      if (this.cTemporaryPassword.tempPassword != this.tempPassword) {
        this.loginInputConfig.TemporaryPasswordInput.attributes.errorMessage = "Error! Check your password and try again."
        this.isLoading = false;
        this.showCreatePassword = false;
      } else {
        this.loginInputConfig.TemporaryPasswordInput.attributes.errorMessage = ''
        // this.showCreatePassword = true;
        this.confirmTemporaryPassword(this.cTemporaryPassword)
        this.isLoading = false;
      }
      
    }, 1500);
  }

  

  onSubmit() {
    // on create password Submit
    console.log(this.cNewPassword);
    this.isLoading = true;
    setTimeout(() => {
      if (this.cNewPassword.newPassword != this.cNewPassword.confirmNewPassword) {
        this.loginInputConfig.ConfirmNewPasswordInput.attributes.errorMessage = "Confirm Password Doesn't Match."

        this.isLoading = false;
      } else {
        this.loginInputConfig.ConfirmNewPasswordInput.attributes.errorMessage = ""
        this.createNewPassword(this.cNewPassword);
        this.isLoading = false;
      }
      
    }, 1500);
  }

  confirmTemporaryPassword(payload: any) {
    this.loginService.confirmTemporaryPassword(payload).subscribe(
      (res : any) => {
        if (res) {
          this.toasty.success(res.message);
          this.showCreatePassword = true;
        }
      }
    )
  }

  createNewPassword(payload: any) {
    this.loginService.createNewPassword(payload).subscribe(
      (res : any) => {
        if (res) {
          this.toasty.success(res.message);
          this.router.navigate(['/auth/login'])
        }
      }
    )
  }
}

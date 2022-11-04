import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IResponseSchema } from 'src/app/configs/api-config';
import {
  LoginIdInput,
  LoginPasswordInput,
  FirstNameInput,
  LastNameInput,
  EmailIdInput,
  TemporaryPasswordInput,
} from 'src/app/configs/plugin-components/login-form.config';
import { ToastContainerDirective } from 'src/app/shared/components/vsa-toasty/vsa-toasty/vsa-toasty.directive';
import { VSAToastyService } from 'src/app/shared/components/vsa-toasty/vsa-toasty/vsa-toasty.service';
import { EncryptedStorage } from 'src/app/shared/utils/encrypted-storage';
import { LoginService } from 'src/app/shared/_http/login.service';
import { CTemporaryPasswordModel, LoginModel } from '../login.model';

@Component({
  selector: 'confirm-temporary-password',
  templateUrl: './confirm-temporary-password.component.html',
  styleUrls: ['./confirm-temporary-password.component.scss'],
  providers: [VSAToastyService],
})
export class ConfirmTemporaryPasswordComponent implements OnInit {
  isLoading?: boolean;
  // Template Ref
  @ViewChild(ToastContainerDirective, { static: true })
  toastContainer?: ToastContainerDirective;

  // Configs
  loginForm: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    emailId: new FormControl('', Validators.required),
    tempPassword: new FormControl('', Validators.required),
  });
  public loginInputConfig = {
    FirstNameInput,
    LastNameInput,
    EmailIdInput,
    TemporaryPasswordInput
  };
  toastyConfig: any;
  tempPassword = "Abc123"

  // Models
  cTemporaryPassword: CTemporaryPasswordModel = new CTemporaryPasswordModel();

  constructor(
    private loginService: LoginService,
    private router: Router,
    private toasty: VSAToastyService
  ) {
    this.loginInputConfig.FirstNameInput.attributes.disable = true;
    this.loginInputConfig.LastNameInput.attributes.disable =
      true;
    this.loginInputConfig.EmailIdInput.attributes.disable =
      true;
  }

  ngOnInit() {
    this.cTemporaryPassword.firstName = "Sharon"
    this.cTemporaryPassword.lastName = "Price"
    this.cTemporaryPassword.emailId = "sharon.price@its.jnj.com"
    new EncryptedStorage().clearAll();
    this.setupToasty();
  }

  setupToasty() {
    this.toasty.overlayContainer = this.toastContainer;
    this.toasty.toastyConfig.preventDuplicates = true;
  }

  onSubmit() {
    // Submit login
    console.log(this.cTemporaryPassword);
    this.isLoading = true;
    setTimeout(() => {
      if (this.cTemporaryPassword.tempPassword != this.tempPassword) {
        this.loginInputConfig.TemporaryPasswordInput.attributes.errorMessage = "Error! Check your password and try again."
        // this.loginInputConfig.TemporaryPasswordInput.attributes.pattern = this.cTemporaryPassword.tempPassword
        // this.loginInputConfig.TemporaryPasswordInput.attributes.customPatternMessage = "Confirm Password Doesn't Match."
        this.isLoading = false;
      } else {
        this.loginInputConfig.TemporaryPasswordInput.attributes.errorMessage = ''
        this.router.navigate(['/auth/create-new-password'])
        this.isLoading = false;
      }
      
    }, 1500);
    
    // this.loginService
    //   .login(this.loginModel)
    //   .subscribe((res: IResponseSchema) => {
    //     if (res.error) {
    //       this.toasty.error(res.message);
    //     } else {
    //       this.toasty.success(res.message);
    //       // this.router.navigate(['/dashboard']);
    //     }
    //     this.isLoading = false;
    //     // Reset Form
    //   });
  }
}

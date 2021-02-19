import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GenericService } from '../services/generic.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { UrlConfig } from '../utilities/url.config';
import { Toaster } from '../utilities/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/enc-dec.service';
import { CustomValidators } from '../dashboard/services/validators';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  submittedReg = false;
  private urlConfig: UrlConfig;
  public toaster: Toaster;

  @ViewChild('dialogVerifyEmail') verifyEmailDialog : TemplateRef<any>

  registerForm: FormGroup;

  constructor(private router: Router, public dialog: MatDialog, private user: UserService, private fb: FormBuilder, private genericService: GenericService, public toastr: ToastrManager) {
    this.urlConfig = new UrlConfig();
    this.toaster = new Toaster(toastr);
  }



  ngOnInit() {
    this.registerForm = this.fb.group({
      user_role: [5, [Validators.required]],
      user_name: [null, [Validators.required]],
      user_company_name: [''],
      user_email: [null, [Validators.required, Validators.email]],
      user_phone: [null, [Validators.pattern(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)]],
      user_address: [null, [Validators.required]],
      user_username: [''],
      user_password: [null, [Validators.required, Validators.minLength(6)]],
      user_confirmpassword: [null, [Validators.required]]
    },
      {
        // check whether our password and confirm password match
        validators: CustomValidators.passwordMatchValidator
      }
    );

  }

  get f1() {
    return this.registerForm.controls;
  }


  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName);
  }

  selectedType: any = 0;
  selectionChange(event) {

    this.selectedType = event.value;
    if (this.selectedType == 4) {
      this.registerForm.get('user_company_name').setValidators([Validators.required])
      this.registerForm.get('user_company_name').updateValueAndValidity()
    } else {

      this.registerForm.get('user_company_name').clearValidators()
      this.registerForm.get('user_company_name').updateValueAndValidity()
    }
  }

  emailToVerify:string= null;
  emailDialog:any;
  stepsTOVerify = 0;

  current_user_id = 0

  onSubmit() {
    this.submittedReg = true;

    let body = this.registerForm.value

    // this.emailToVerify = this.registerForm.controls["user_email"].value
    // this.emailDialog = this.dialog.open(this.verifyEmailDialog,{ disableClose: true });
    
    // on dialog show process steps
    this.stepsTOVerify = 1
    
    // this.toaster.showMessage("registration success", "", "success");
    // this.emailToVerify = "Shelkeakshay.2016@gmail.com"
    // this.current_user_id = 1;
    // this.emailDialog = this.dialog.open(this.verifyEmailDialog,{ disableClose: true });
    // return ;

    if (this.registerForm.invalid) {
      return false;
    }

    this.genericService.action('register', 'POST', body).subscribe(
      response => {
        if (response.statusCode == 200) {

          this.toaster.showMessage(response.statusMessage, "", "success");
          this.emailToVerify = this.registerForm.controls["user_email"].value
          this.current_user_id = response.respData.user_id;

          this.emailDialog = this.dialog.open(this.verifyEmailDialog,{ disableClose: true });

        } else {
          this.toaster.showMessage(response.statusMessage, "", "error");
        }

      }, error => {
        this.toaster.showMessage("Error while registration, Try again", "", "error");
      }
    );
  }


  isVerifyEmailDisabled : boolean = true;
  sendMailVerification(){
    let emailObj = {
      user_email: this.emailToVerify,
      is_for:'register_otp',
      user_id: this.current_user_id
    }

    // this.toaster.showMessage("OTP send success", "", "success");
    // this.stepsTOVerify = 2
    // return;
    this.genericService.action('send-mail', 'POST', emailObj).subscribe(
      response => {
        if (response.statusCode == 200) {

          this.toaster.showMessage(response.statusMessage, "", "success");
          this.stepsTOVerify = 2
        } else {
          this.toaster.showMessage(response.statusMessage, "", "error");
        }
      }, error => {
        this.toaster.showMessage("Could Not send OTP try again", "", "error");
      }
    );
  }

  verifyOtp(otpToVerify){
    
    let emailObj = {
      otp: otpToVerify.value,
      username: this.emailToVerify
    }

    this.genericService.action('verify-otp', 'POST', emailObj).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.toaster.showMessage(response.statusMessage, "", "success");
          this.router.navigate(['/']);
          this.dialog.closeAll();
        } else {
          this.toaster.showMessage(response.statusMessage, "", "error");
        }
      }, error => {
        this.toaster.showMessage("Could not verify OTP Now, Please login", "", "error");
        this.router.navigate(['/']);
      }
    );
  }

}

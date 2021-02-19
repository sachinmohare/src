import { Component, OnInit } from '@angular/core';
import { GenericService } from '../services/generic.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { UrlConfig } from '../utilities/url.config';
import { Toaster } from '../utilities/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/enc-dec.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  submitted = false;
  private urlConfig: UrlConfig;
  public toaster: Toaster;

  loginForm: FormGroup;


  constructor(private router: Router, private user: UserService, private fb: FormBuilder, private genericService: GenericService, public toastr: ToastrManager) {
    this.urlConfig = new UrlConfig();
    this.toaster = new Toaster(toastr);
  }
  get f1() {
    return this.loginForm.controls;
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }


  onSubmit() {
    this.submitted = true;
    console.log("hii")
    let body = this.loginForm.value

    let url: string = this.urlConfig.LOGIN;// + "?username=" + this.model.user.username + "&password=" + this.model.user.password + "&grant_type=password";

    this.genericService.action(url, 'POST', body).subscribe(
      response => {
        if (response.statusCode == 200) {
          //set user details 
          this.user.setUser(response.respData);
          this.router.navigate(['/dashboard/add-lead']);
        } else {
          this.toaster.showMessage("Email Id or Password do not match", "", "error");
        }

      },
      error => {
        localStorage.removeItem(error);
        if (error.status == 400 || error.status == 401)
          this.toaster.showMessage("Email Id or Password do not match", "", "error");
        this.router.navigate(['login'])
      }
    );
  }



  emailToVerify:string= null;
  stepsTOVerify = 0;

  sendMailVerification(){
    let emailObj = {
      user_email: this.emailToVerify,
      is_for:'forgot-pass',
    }

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
          this.stepsTOVerify = 3
        } else {
          this.toaster.showMessage(response.statusMessage, "", "error");
        }
      }, error => {
        this.toaster.showMessage("Could not verify OTP Now, Please login", "", "error");
        this.router.navigate(['/']);
      }
    );
  }


  
  createNewPassword(newpass){
    
    let emailObj = {
      newPassword: newpass.value,
      username: this.emailToVerify,
      step: 3
    }

    this.genericService.action('forgot-password', 'POST', emailObj).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.toaster.showMessage(response.statusMessage, "", "success");
          this.stepsTOVerify = 0
        } else {
          this.toaster.showMessage(response.statusMessage, "", "error");
          
        }
      }, error => {
        this.toaster.showMessage("Please try again", "", "error");
        
      }
    );
  }

}
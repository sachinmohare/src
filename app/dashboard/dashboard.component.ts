import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Toaster } from '../utilities/common';
import { GenericService } from '../services/generic.service';
import { UrlConfig, } from '../utilities/url.config';
import { MatDialog } from '@angular/material/dialog';
declare var $: any;


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public toaster: Toaster;
  private urlConfig: UrlConfig;

  @ViewChild('dialogVerifyEmail') verifyEmailDialog: TemplateRef<any>
  stepsTOVerify = 1;
  emailToVerify = null;
  currentUser = null
  emailDialog: any;
  

  constructor(public dialog: MatDialog, private router: Router, public genericService: GenericService, public toastr: ToastrManager) {
    this.toaster = new Toaster(toastr);
    this.urlConfig = new UrlConfig();

  }

  ngOnInit() {

    this.currentUser = this.genericService.getUserData();

    $("#menu-toggle").click(function (e) {
      e.preventDefault();
      $("#wrapper").toggleClass("active");
      $("#left-container").toggleClass("less-width");
      $("#right-container").toggleClass("full-width");
    });


    this.genericService.action('is_verified', 'GET').subscribe(
      response => {
        if (response.statusCode == 200) {

          if (response.respData.is_user_verified == 0) {
            console.log(this.currentUser)
            this.emailToVerify = this.currentUser.user_email
            this.emailDialog = this.dialog.open(this.verifyEmailDialog, { disableClose: true });
          }
          // console.log(response)
        } else {
          this.toaster.showMessage("Sorry for inconvinience, Please login again! ", "", "error");
          this.logout();
        }
      }, error => {
        this.toaster.showMessage("Error while Dual verification, Try again", "", "error");
        this.logout();
      }
    );






  }


  isVerifyEmailDisabled : boolean = true;
  sendMailVerification(){
    let emailObj = {
      user_email: this.emailToVerify,
      is_for:'register_otp',
      user_id: this.currentUser.user_id
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



  logout() {
    localStorage.clear();
    this.router.navigate(['/']);

    this.dialog.closeAll();
    // let url:string = this.urlConfig.CONFIG.LOGOUT;
    // let request = new RequestObject(url,this.reqtype.TYPE.GET,null,null);
    // localStorage.setItem("login","false");
    // this.router.navigate(['/']);
    // this.genericService.action(request).subscribe(
    //   response => {
    //     this.toaster.showMessage("You have logged out.", "", "success");
    //      localStorage.clear();
    //   },error => {
    //     console.log(error);
    //   }
    // )
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Toaster } from '../../utilities/common';
import { GenericService } from '../../services/generic.service';
import { CustomValidators } from '../services/validators';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userProfileForm:FormGroup;
  securityForm :FormGroup;
  selectedType: number = 3;
  hide =true;
  public toaster: Toaster;

  constructor(private fb: FormBuilder,
    private genericService: GenericService,
    public toastr: ToastrManager,
    public activateRoute: ActivatedRoute) {
    this.toaster = new Toaster(toastr);
  }

  ngOnInit() {

    this.securityForm = this.fb.group({
      user_old_password:['', [Validators.required, Validators.minLength(6)]],
      user_password: ['', [Validators.required, Validators.minLength(6)]],
      user_confirmpassword: ['', [Validators.required]]
    },
      {
        // check whether our password and confirm password match
        validators: CustomValidators.passwordMatchValidator
      }
    );

  
    if (this.activateRoute.snapshot.data.profileData) {
      let obj = (this.activateRoute.snapshot.data.profileData).respData;

      // console.log(obj)

      
        this.selectedType = obj.role.role_code
      
      console.log('type',this.selectedType);

      this.userProfileForm = this.fb.group({
        user_name: [obj.user_name, [Validators.required]],
        user_company_name: [obj.user_company_name],
        user_email: [obj.user_email, [Validators.required, Validators.email]],
        user_address: [obj.user_address, [Validators.required]],
        user_phone: [obj.user_phone, [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(10), Validators.maxLength(10)]]
      }
      );

      if(this.selectedType==4){
        this.userProfileForm.controls['user_company_name'].setValidators([Validators.required]);
        this.userProfileForm.controls['user_company_name'].updateValueAndValidity();
      }
    }
  
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.userProfileForm.controls[controlName].hasError(errorName);
  }

  public hasSecurityError = (controlName: string, errorName: string) => {
    return this.securityForm.controls[controlName].hasError(errorName);
  }

  onSubmitSecuritySettings(){

    if(this.securityForm.invalid)
      return;

    this.genericService.action("user/change-password", 'PUT',this.securityForm.value).subscribe(
      RespData => {
        if (RespData.statusCode == 200) {
          this.toaster.showMessage(RespData.statusMessage, "", "success")
        } else {
          this.toaster.showMessage(RespData.statusMessage, "", "error")
        }
      }
    );

  }

  onSubmit(){
    if(this.userProfileForm.invalid)
        return ;
        
    this.genericService.action("user/update-profile", 'PUT',this.userProfileForm.value).subscribe(
      RespData => {
        if (RespData.statusCode == 200) {
          this.toaster.showMessage(RespData.statusMessage, "", "success")
        } else {
          this.toaster.showMessage(RespData.statusMessage, "", "error")
        }
      }
    );
  }
}



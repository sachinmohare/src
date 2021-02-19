import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Toaster } from '../../utilities/common';
import { GenericService } from '../../services/generic.service';
import { CustomValidators } from '../services/validators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-technician',
  templateUrl: './add-technician.component.html',
  styleUrls: ['./add-technician.component.css']
})
export class AddTechnicianComponent implements OnInit {

  public toaster: Toaster;
  hide = true;//for paasssword eye
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  addtechnicianForm: FormGroup;
  get f() { return this.addtechnicianForm.controls; }

  constructor(private fb: FormBuilder,
    private genericService: GenericService,
    public toastr: ToastrManager,
    public activateRoute: ActivatedRoute) {
    this.toaster = new Toaster(toastr);
  }

  isForUpdate = false;
  ngOnInit() {
    this.isForUpdate = false;

    this.addtechnicianForm = this.fb.group({
      user_id: [''],
      user_name: ['', [Validators.required]],
      user_email: ['', [Validators.required, Validators.email]],
      user_address: ['', [Validators.required]],
      user_phone: ['', [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(10), Validators.maxLength(10)]],
      user_username: ['', [Validators.required, Validators.minLength(6)]],
      user_password: ['', [Validators.required, Validators.minLength(6)]],
      user_confirmpassword: ['', [Validators.required]]
    },
      {
        // check whether our password and confirm password match
        validators: CustomValidators.passwordMatchValidator
      }
    );




    // is for update
    console.log('t d => ',this.activateRoute.snapshot.data);
    if (this.activateRoute.snapshot.data.technicianData) {
      this.isForUpdate = true
      console.log('edit data - ', this.activateRoute.snapshot.data.technicianData)
      let obj = this.activateRoute.snapshot.data.technicianData;
      if (obj.statusCode == 200) {

        this.addtechnicianForm.patchValue({
          user_id: obj.respData[0].user_id,
          user_name: obj.respData[0].user_name,
          user_email: obj.respData[0].user_email,
          user_address: obj.respData[0].user_address,
          user_phone: obj.respData[0].user_phone,
          user_username: obj.respData[0].user_username,
          user_password: obj.respData[0].user_password,
          user_confirmpassword: obj.respData[0].user_password
        })

      } else {
        this.toaster.showMessage("Oops can't update right now, Try again !", "", "error")
      }
    }

  }


  public hasError = (controlName: string, errorName: string) => {
    return this.addtechnicianForm.controls[controlName].hasError(errorName);
  }

  technicianId: number
  clearData() {
    this.formDirective.resetForm();
    this.technicianId = 0;
  }



  public updateData() {

    console.log(this.addtechnicianForm.value);

    if (this.addtechnicianForm.invalid) {
      this.toaster.showMessage("Please fill all form correctly !", "", "error")
      return;
    }

    let requestArray = this.addtechnicianForm.value

    // console.log(requestArray);
    this.genericService.action("admin/update-technician", 'PUT', requestArray).subscribe(
      RespData => {
        // console.log(RespData);
        if (RespData.statusCode == 200) {

          this.toaster.showMessage(RespData.statusMessage, "", "success")
        }
        else {
          this.toaster.showMessage(RespData.statusMessage, "", "error")

        }
      }
    );
  }


  onSubmit() {

    if (this.addtechnicianForm.invalid) {
      this.toaster.showMessage("Please fill all form correctly !", "", "error")
      return;
    }

    let requestArray = this.addtechnicianForm.value
    console.log(requestArray);

    this.genericService.action("admin/add-technician", 'POST', requestArray).subscribe(
      RespData => {
        if (RespData.statusCode == 200) {
          this.technicianId = 0;
          this.toaster.showMessage(RespData.statusMessage, "", "success")
          this.formDirective.resetForm();
        } else {
          this.toaster.showMessage(RespData.statusMessage, "", "error")
        }

      }
    );

  }

}

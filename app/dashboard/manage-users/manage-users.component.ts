import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { GenericService } from '../../services/generic.service';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Toaster } from '../../utilities/common';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../services/validators';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {

  @ViewChild('dialogDeleteUser') dialogDeleteUser: TemplateRef<any>
  @ViewChild('dialogShowUser') dialogShowUser: TemplateRef<any>
  @ViewChild('dialogChangePassword') dialogChangePassword: TemplateRef<any>



  public techniciansList: any = [];
  public searchText: any;
  public selectedText: any;
  public toaster: Toaster;
  isChecked: boolean = false;
  userModel: any = {
    created_date: "",
    is_user_verified: "",
    status: "",
    user_address: "",
    user_company_name: "",
    user_email: "",
    user_id: "",
    user_name: "",
    user_phone: "",
    user_role: ""
  }
  hide:boolean = true

  changePass: FormGroup;
  get f() { return this.changePass.controls; }

  p: number = 1;

  constructor(
    private fb: FormBuilder
    , public route: Router,
    public activateRoute: ActivatedRoute,
    public genericService: GenericService,
    public toastr: ToastrManager,
    public dialog: MatDialog) {
    this.toaster = new Toaster(toastr);
  }

  ngOnInit() {

    this.changePass = this.fb.group({
      user_id: [''],
      user_password: ['', [Validators.required, Validators.minLength(6)]],
      user_confirmpassword: ['', [Validators.required]]
    },
      {
        // check whether our password and confirm password match
        validators: CustomValidators.passwordMatchValidator
      }
    );


    // get complaints
    this.genericService.action("admin/get-all-users-list", 'GET').subscribe(
      RespData => {
        if (RespData.statusCode == 200) {
          let d = RespData.respData;
          console.log(d);

          d.sort((a, b) => (a.complaint_id < b.complaint_id) ? 1 : -1)
          this.techniciansList = d;
          // console.log(this.techniciansList)
        } else {
          alert(RespData.statusMessage);
        }
      }
    );



  }

  goToLeads(id: any) {
    //  { relativeTo: this.route }
    this.route.navigate(['view-leads/' + id], { relativeTo: this.activateRoute });

  }

  statusChanged(event, user_id) {
    // console.log(event.checked)
    let obj = {
      user_id: user_id,
      status: event.checked
    }
    this.genericService.action("admin/delete-technician", 'POST', obj).subscribe(
      RespData => {
        if (RespData.statusCode == 200) {
          if (event.checked)
            this.toaster.showMessage("User is Activated", "", "success")
          else
            this.toaster.showMessage("User is Inactivated", "", "warn")
        } else {
          this.toaster.showMessage("User can't Inactive", "", "error")
        }
      }
    );
  }


  makeUserAdmin(event: any, user_id, index) {

    let obj = {
      user_id: user_id,
      role: event.checked ? 2 : 3
    }

    this.genericService.action("admin/update-user-role", 'PUT', obj).subscribe(
      RespData => {
        if (RespData.statusCode == 200) {
          if (event.checked) {
            this.techniciansList[index].user_role = 2
            this.toaster.showMessage("Admin access granted to user", "", "success")
          }
          else {
            this.techniciansList[index].user_role = 3
            this.toaster.showMessage("Admin access removed", "", "warn")
          }
        } else {
          this.toaster.showMessage(RespData.statusMessage, "", "error")
        }
      }
    );




  }


  viewTechnician(dataObj: any) {
    console.log(dataObj)
    //  this.dialog.open(ViewTechnicianDialog, { data:dataObj });
  }

  deleteUserId: number = 0;
  currentIndexToDelete: number = 0;

  openDeleteConfirmation(user_id, index) {
    this.deleteUserId = user_id;
    this.currentIndexToDelete = index;
    this.dialog.open(this.dialogDeleteUser, { disableClose: true });
  }

  deleteUser() {
    let RequestedObject = {
      "user_id": this.deleteUserId,
      "status": -1
    }

    if (this.genericService.hasRole(['SA'])) {

      if (!confirm('User will permenently deleted')) {
        this.dialog.closeAll();
        return false;
      } else {
        RequestedObject.status = -1
      }
    } else if (this.genericService.hasRole(['A'])) {
      RequestedObject.status = 0
    }


    this.genericService.action("admin/delete-user", 'POST', RequestedObject).subscribe(
      RespData => {
        if (RespData.statusCode == 200) {
          this.toaster.showMessage("User Deleted Success", "", "success")
          this.techniciansList.splice(this.currentIndexToDelete, 1)
          this.dialog.closeAll()
        } else {
          this.toaster.showMessage("Can't Delete User, Try again!", "", "error")
          this.dialog.closeAll()
        }

      }
    );

  }



  viewUser(userData: any) {
    this.dialog.open(this.dialogShowUser, { disableClose: true, panelClass: 'full-width-dialog' })
    this.userModel = userData;
  }

  closeDialog() {
    this.dialog.closeAll()
  }


  public hasError = (controlName: string, errorName: string) => {
    return this.changePass.controls[controlName].hasError(errorName);
  }

  settingsUser(userId) {
    this.changePass.reset()
    
    let obj = {
      user_id: userId,
      user_password: '',
      user_confirmpassword: ''
    }

    this.changePass.patchValue(obj);

    this.dialog.open(this.dialogChangePassword, { disableClose: true })
  }

  onPassChange() {

    if(this.changePass.invalid){
      return false;
    }

    this.genericService.action("admin/change-security",'PUT',this.changePass.value).subscribe( (RespData:any)=>{

      if (RespData.statusCode == 200) {
        this.toaster.showMessage("Security settings Updated", "", "success")
        // this.techniciansList.splice(this.currentIndexToDelete, 1)
        this.dialog.closeAll()
      } else {
        this.toaster.showMessage("Can't update settings, Try again!", "", "error")
        this.dialog.closeAll()
      }

    })

  }
}




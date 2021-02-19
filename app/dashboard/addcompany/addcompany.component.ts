import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { GenericService } from 'src/app/services/generic.service';
import { Toaster } from 'src/app/utilities/common';
import { UrlConfig } from 'src/app/utilities/url.config';
import { editLeadadmin } from '../models/adminModel';
import { AdminSharedService } from '../services/admin-shared.service';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-addcompany',
  templateUrl: './addcompany.component.html',
  styleUrls: ['./addcompany.component.css']
})
export class AddcompanyComponent implements OnInit {

  public toaster: Toaster;

  public model: any = {};
  addcomplaintsForm: FormGroup;
  submitted = false;
  public getApi: any = [];
  isShow = false;
  public curDate = new Date();
  isAssined: any;
  // for autocomplate
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  // current companies
  companylist: any = [];
  flag = 0;
  user_id = 0;


  constructor(public dialog: MatDialog, private userObjectReset: editLeadadmin, private adminSharedService: AdminSharedService, private location: Location, private fb: FormBuilder, public route: Router, private router: Router, public genericService: GenericService, public toastr: ToastrManager, public activateRoute: ActivatedRoute) {
    this.toaster = new Toaster(toastr);

    // form init
    this.addcomplaintsForm = this.fb.group({
      user_id: [null],
      user_name: [null, [Validators.required]],
      user_company_name: [null],
      user_email: [null, [Validators.required, Validators.email]],
      user_phone: ['', [Validators.pattern(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)]],
      user_address: [null, [Validators.required]],
      user_complaint: [null, [Validators.required]],
      technician_id: [null],
      isAssined: [null]
    })


  }



  isForUpdate = false;
  currentUser: any;
  company_name: any=null;

  ngOnInit() {
    this.currentUser = this.genericService.getUserData();

    if (!this.activateRoute.snapshot.data.leadData && this.genericService.hasRole(['ORG'])) {
      this.myControl.patchValue(this.currentUser.user_company_name)
      this.addcomplaintsForm.patchValue({
        user_id: this.currentUser.user_id,
        user_name: this.currentUser.user_name,
        user_company_name: this.currentUser.user_company_name,
        user_email: this.currentUser.user_email,
        user_phone: this.currentUser.user_phone,
        user_address: this.currentUser.user_address,
        user_complaint: null,
        technician_id: 0,
        isAssined: false
      })
      // this.addcomplaintsForm.controls['user_company_name'].disable();
    }




    // on update lead
    this.isForUpdate = false;
    // is come for update
    if (this.activateRoute.snapshot.data.leadData) {
      this.isForUpdate = true
      console.log('edit data - ', this.activateRoute.snapshot.data.leadData)
      let obj = this.activateRoute.snapshot.data.leadData;
      if (obj.statusCode == 200) {
        if (obj.respData[0].technician_id == 0 || obj.respData[0].technician_id == '0')
          this.isAssined = false;
        else {
          this.isAssined = true;
          this.isShow = true
        }

        this.myControl.patchValue(obj.respData[0].company_name)

        this.addcomplaintsForm.patchValue({
          user_id: obj.respData[0].complaint_id,
          user_name: obj.respData[0].customer_name,
          user_company_name: obj.respData[0].company_name,
          user_email: obj.respData[0].customer_email,
          user_phone: obj.respData[0].customer_mobile,
          user_address: obj.respData[0].company_address,
          user_complaint: obj.respData[0].complaint_desc,
          technician_id: obj.respData[0].technician_id,
          isAssined: this.isAssined
        })
        this.addcomplaintsForm.controls['user_company_name'].disable();
      } else {
        this.toaster.showMessage("Oops can't update right now, Try again !", "", "error")
      }
    } else { // is form open for add new complaint
      if (this.genericService.hasRole(['A', 'SA','T'])) // if role admin or super admin get all company list, they can add lead of any company
        this.getCompanyList();
      else { // if user is organisation / normal user then they can't change company name
        if (this.genericService.hasRole(['ORG']) || this.genericService.hasRole(['NU'])) {
          this.addcomplaintsForm.patchValue({
            user_id: this.currentUser.user_id,
            user_name: this.currentUser.user_name,
            user_company_name: this.genericService.hasRole(['ORG']) ? this.currentUser.user_company_name : null,
            user_email: this.currentUser.user_email,
            user_phone: this.currentUser.user_phone,
            user_address: this.currentUser.user_address,
            user_complaint: null,
            technician_id: 0,
            isAssined: false
          });
        }
        this.company_name = this.currentUser.user_company_name
        this.addcomplaintsForm.controls['user_company_name'].disable();
      }
    }


    this.genericService.action("admin/get-technician-list", 'GET').subscribe(
      RespData => {
        if (RespData.statusCode == 200) {
          this.getApi = RespData.respData;
        }
        else {
          this.toaster.showMessage(RespData.statusMessage, "", "error");
        }
      }
    );


    // on select company from list 
    this.filteredOptions = this.myControl.valueChanges
      .pipe( 
        startWith(''),
        map(value => {
          // console.log( value)
          if (value && value != null && value != '') {
            this.user_id = null;
            this.addcomplaintsForm.controls['user_id'].setValue(this.user_id);
          }
          return value && value != null && value != '' ? this._filter(value) : this.companylist.slice()
        }
        )
      );



    // if user is technician added lead then he can add to himselef only not to other technicians
    // if(this.genericService.hasRole(['T'])){

    //   this.addcomplaintsForm.patchValue({
    //     technician_id:this.currentUser.user_id,
    //     isAssined: true
    //   })
    //   this.isShow = true;
    //   this.addcomplaintsForm.controls['technician_id'].disable();
    //   this.addcomplaintsForm.controls['isAssined'].disable();
    // }

  }

  private getCompanyList() {
    this.genericService.action('admin/get-company-list', 'GET').subscribe(data => {
      console.log(data);
      this.companylist = data.respData
    })
  }

  private _filter(vendor: any): string[] {
    return this.companylist.filter(opt => opt.user_company_name.toLowerCase().indexOf(vendor.toLowerCase()) === 0);
  }


  clearData() {
    this.addcomplaintsForm.reset();
    this.user_id = 0;
  }

  selectEvent(item) {
    // do something with selected item
    this.flag = 0;


    if (item != null) {
      this.addcomplaintsForm.controls['user_id'].setValue(item.user_id);
      this.addcomplaintsForm.controls['user_company_name'].setValue(item.user_company_name);
      this.addcomplaintsForm.controls['user_address'].setValue(item.user_address);
      this.addcomplaintsForm.controls['user_complaint'].setValue(item.user_complaint);
      this.addcomplaintsForm.controls['user_name'].setValue(item.user_name);
      this.addcomplaintsForm.controls['user_phone'].setValue(item.user_phone);
      this.addcomplaintsForm.controls['user_email'].setValue(item.user_email);
    }
    else {
      this.addcomplaintsForm.controls['user_id'].setValue(null)
      this.addcomplaintsForm.controls['user_company_name'].setValue(null)
      this.addcomplaintsForm.controls['user_address'].setValue(null)
      this.addcomplaintsForm.controls['user_complaint'].setValue(null)
      this.addcomplaintsForm.controls['user_name'].setValue(null)
      this.addcomplaintsForm.controls['user_phone'].setValue(null)
      this.addcomplaintsForm.controls['user_email'].setValue(null)
      this.addcomplaintsForm.controls['technician_id'].setValue(0);
      this.addcomplaintsForm.controls['isAssined'].setValue(false);
    }

  }

  isSelectedFromList = false
  onSelectionChanged(e) {
    console.log('on select -', e.option.value)
    // this.user_company_name = e.option.value;
    let obj = this.companylist.filter(opt => opt.user_company_name.toLowerCase().indexOf(e.option.value.toLowerCase()) === 0);
    this.selectEvent(obj[0])
  }

  notFoundTemplate(data) {

    console.log(data);
    console.log("inn notFoundTemplate");
  }


  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    this.flag = 1;

    this.user_id = 0;
    // this.companyname = val
    // console.log(val);
    // this.selectEvent({
    //   company_address: '',
    //   customer_name: "",
    //   customer_mobile: "",
    //   customer_email: "",
    //   user_id: "",
    //   lead_user_id: "",
    //   company_name: ""
    // })

  }



  getOptionText(option: any) {
    return option ? option : undefined;
  }


  public hasError = (controlName: string, errorName: string) => {
    return this.addcomplaintsForm.controls[controlName].hasError(errorName);
  }

  public onCancel = () => {
    this.location.back();
  }
  public createOwner = (ownerFormValue) => {
    if (this.addcomplaintsForm.valid) {
      // this.executeValidation(ownerFormValue);
    }
  }

  showDropDown() {
    this.isShow = !this.isShow
    // console.log(this.isShow);
    if (!this.addcomplaintsForm.controls['isAssined'].value) {
      this.addcomplaintsForm.controls['technician_id'].setValue(0);
      this.addcomplaintsForm.controls['isAssined'].setValue(false);
    } else {
      this.addcomplaintsForm.controls['technician_id'].setValidators([Validators.required])
      this.addcomplaintsForm.controls['technician_id'].updateValueAndValidity();
    }
  }

  checkValueFor() {

    // this.filteredOptions.subscribe(data=>{
    //   // console.log('filtered -> ',data);
    // })
  }

  public msg = '';
  public updateData() {

    console.log(this.addcomplaintsForm.value);

    if (this.addcomplaintsForm.invalid) {
      this.toaster.showMessage("Please fill all form correctly !", "", "error")
      return;
    }

    let requestArray = this.addcomplaintsForm.value

    // console.log(requestArray);
    this.genericService.action("admin/update-complaint", 'PUT', requestArray).subscribe(
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

    // console.log(this.myControl.value);
    this.addcomplaintsForm.controls['user_company_name'].setValidators([]);
    this.addcomplaintsForm.controls['user_company_name'].setValue(this.myControl.value);
    
    // if (this.genericService.hasRole(['ORG']))
    //   this.addcomplaintsForm.controls = this.currentUser.user_company_name
    // else if (this.genericService.hasRole(['NU'])) {
    //   this.company_name = this.currentUser.user_name
    // }

    // if(this.genericService.hasRole(['T'])){
    //   this.addcomplaintsForm.controls['technician_id'].setValue(this.currentUser.user_id);
    //   this.addcomplaintsForm.controls['isAssined'].setValue(true); 
    // }

    if (this.genericService.hasRole(['T', 'ORG', 'NU'])) {
      this.addcomplaintsForm.controls['technician_id'].setValue(0);
      this.addcomplaintsForm.controls['isAssined'].setValue(false);
    }

    if (this.addcomplaintsForm.invalid) {
      this.toaster.showMessage("Please fill all form correctly !", "", "error")
      return;
    }

    //if user id is null then add complaint as a new customer so register the customer as dorganisation or normal user
    if (this.addcomplaintsForm.controls['user_id'].value == null) {
      const dialogRef = this.dialog.open(GetRegisterTypeDialog, {
        data: this.addcomplaintsForm.value
      });
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.addcomplaintsForm.reset();
          this.getCompanyList()
        }
      });

      return;
    }

    
      // console.log(this.addcomplaintsForm.value);
      // return

    // this.addcomplaintsForm.controls['user_company_name'].enable();
    let requestArray = this.addcomplaintsForm.value
    // this.addcomplaintsForm.controls['user_company_name'].disable();

    console.log(requestArray);
    // return;

    this.genericService.action("admin/add-complaint", 'POST', requestArray).subscribe(
      RespData => {
        // console.log(RespData);
        if (RespData.statusCode == 200) {
          this.toaster.showMessage(RespData.statusMessage, "", "success")
          this.addcomplaintsForm.reset();
        } else {
          this.toaster.showMessage(RespData.statusMessage, "", "error")
        }
      }
    );
  }


  clearAll() {
    this.model.stock = {};
    this.model.update = false;
  }

}





@Component({
  selector: 'get-register-type-dialog',
  templateUrl: 'get-registration-type.html',
})
export class GetRegisterTypeDialog {
  public toaster: Toaster;

  constructor(
    public dialogRef: MatDialogRef<GetRegisterTypeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private genericService: GenericService,
    public toastr: ToastrManager) {

    this.toaster = new Toaster(toastr);
  }

  selectedType: any = null;
  showError: boolean = false;

  selectionChange(event) {
    this.selectedType = event.value;
    this.showError = false
  }

  onConfirmClick(): void {

    if (!!this.selectedType) {
      this.showError = false
      let requestArray: any = this.data
      requestArray['role_type'] = this.selectedType;
      console.log(requestArray);

      this.genericService.action("admin/add-complaint", 'POST', requestArray).subscribe(
        RespData => {
          // console.log(RespData);
          if (RespData.statusCode == 200) {
            this.toaster.showMessage(RespData.statusMessage, "", "success")
            this.dialogRef.close(true)
          } else {
            this.toaster.showMessage(RespData.statusMessage, "", "error")
            this.dialogRef.close(false)
          }
        }
      );

    } else {
      this.showError = true
    }

  }
}
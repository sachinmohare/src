import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { GenericService } from '../../services/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Toaster } from '../../utilities/common';


import { Pipe, PipeTransform } from '@angular/core';

// import * as XLSX from 'xlsx';


@Pipe({ name: 'convertFrom24To12Format' })
export class TimeFormat implements PipeTransform {
  transform(time: any): any {
    let hour = (time.split(':'))[0]
    let min = (time.split(':'))[1]
    let part = hour > 12 ? 'pm' : 'am';
    min = (min + '').length == 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour + '').length == 1 ? `0${hour}` : hour;
    return `${hour}:${min} ${part}`
  }
}



@Component({
  selector: 'app-leadlist',
  templateUrl: './leadlist.component.html',
  styleUrls: ['./leadlist.component.css'],

})
export class LeadlistComponent implements OnInit {

  public leadList: any = [];
  public searchText: any;
  public selectedText: any;
  public static currentToUpdateStatus: any;
  public toaster: Toaster;
  p:number=1;
  constructor(
    public route: Router,
    public genericService: GenericService,
    public toastr: ToastrManager,
    public dialog: MatDialog,
    public activateRoute: ActivatedRoute) {
    this.toaster = new Toaster(toastr);
  }


  isForPerticularTechnician = false;
  Neww = 0;
  completedd = 0;
  pendingg = 0;
  failedd = 0;

  ngOnInit() {



    // get only for selected technician
    if (this.activateRoute.snapshot.data.technicianData) {
      this.isForPerticularTechnician = true
      let obj = this.activateRoute.snapshot.data.technicianData;
      if (obj.statusCode == 200) {

        let d = obj.respData;
        d.sort((a, b) => (a.complaint_id < b.complaint_id) ? 1 : -1)
        this.leadList = d;
        this.updateCounts();
      } else {
        this.toaster.showMessage("Oops can't get record right now, Try again !", "", "error")
      }
    } else {

      // get all complaints
      this.genericService.action("admin/current-complaint-list", 'GET').subscribe(
        RespData => {
          if (RespData.statusCode == 200) {
            let d = RespData.respData;
            d.sort((a, b) => (a.complaint_id < b.complaint_id) ? 1 : -1)
            
            this.leadList = d;
            this.updateCounts();
            console.log(this.leadList)
          } else {
            alert(RespData.statusMessage);
          }
        }
      );
    }


    
  }


  // exportLeads(){
  //     let filename = 'leads' + new Date('yyyy-mm-dd');

  //     /* table id is passed over here */   
  //     let element = document.getElementById('lead-list-table'); 
  //     const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

  //     /* generate workbook and add the worksheet */
  //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //     /* save to file */
  //     XLSX.writeFile(wb, filename);
     
   
  // }

  updateCounts(){
   this.Neww = 0;
   this.completedd = 0;
   this.pendingg = 0;
   this.failedd = 0;

    this.leadList.map(e => {
      e.complaint_status == 0 ? this.Neww++ : '';
      e.complaint_status == 1 ? this.completedd++ : '';
      e.complaint_status == 2 ? this.pendingg++ : '';
      e.complaint_status == 3 ? this.failedd++ : '';
    })
  }
  goToEditLead(id: any) {
    //  { relativeTo: this.route }
    this.route.navigate(['edit-lead/' + id], { relativeTo: this.activateRoute });

  }

  changeStatus(details: any, index) {
    details.index = index
    // const obj = details
    let g = this.dialog.open(MatDialogStatus, { data: details });
    g.afterClosed().subscribe((data) => {
      this.Neww = 0;
      this.completedd = 0;
      this.pendingg = 0;
      this.failedd = 0;

     
      this.leadList.map(e => {
        e.status.Complaint_status == 0 ? this.Neww++ : '';
        e.status.Complaint_status == 1 ? this.completedd++ : '';
        e.status.Complaint_status == 2 ? this.pendingg++ : '';
        e.status.Complaint_status == 3 ? this.failedd++ : '';
      })      
      
    });


  }

  viewLead(dataObj: any) {
    console.log(dataObj)
    this.dialog.open(ViewLeadDialog, { data: dataObj });
  }


  deleteLead(objToDelete, index: number) {


    const dialogRef = this.dialog.open(DeleteLeadDialog, {
      data: objToDelete
    });


    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.leadList.splice(index, 1)
        this.updateCounts();
      }
    });


  }


}


@Component({
  selector: 'mat-dialog-status',
  templateUrl: 'mat-dialog-status.html',
  styles: [
    `.mat-form-field {
        width: 100%;
      }`
  ]
})
export class MatDialogStatus {

  showInput:boolean= false;
  description = "";
  obj = null;
  public toaster: Toaster;

  constructor(
    public dialogRef: MatDialogRef<MatDialogStatus>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public genericService: GenericService,
    public toastr: ToastrManager) {
    this.obj = {}
    this.description = data.solution
    this.toaster = new Toaster(toastr);
  }

  changeStatus(status, message) {
    this.obj = { status: status, message: message, index: this.data.index };
  }

  onOk() {


    if (this.obj && (this.obj.status == 1 || this.obj.status == 3 || this.obj.status == 2) && (this.description == '' || this.description == null)) {
      alert("please fill the description")
      return false;
    } else if (!('status' in this.obj)) {
      alert("please select status")
      return false
    }

    let body = {
      complaint_id: this.data.complaint_id,
      solution: this.description,
      complaint_status: this.obj.status
    }

    this.genericService.action("admin/update-complaint-status", 'PUT', body).subscribe(RespData => {
      if (RespData.statusCode == 200) {

        this.data.status.Complaint_status = this.obj.status;
        this.data.status.Complaint_message = this.obj.message;
        this.data.solution = this.description;
        this.dialogRef.close(this.data);
        this.toaster.showMessage("Status Updated Success", "", "success")

      } else {
        this.toaster.showMessage("No change in status to update", "", "error")
      }
    })

  }

  onCancel() {
    this.dialogRef.close();
  }
}




@Component({
  selector: 'view-lead-dialog',
  templateUrl: 'view-lead-dialog.html',
})
export class ViewLeadDialog {
  constructor(
    public dialogRef: MatDialogRef<ViewLeadDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log(data)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}




@Component({
  selector: 'delete-lead-dialog',
  templateUrl: 'delete-lead-dialog.html',
})
export class DeleteLeadDialog {
  public toaster: Toaster;

  constructor(
    public dialogRef: MatDialogRef<DeleteLeadDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public dataTechnician: any,
    private genericService: GenericService,
    public toastr: ToastrManager) {

    this.toaster = new Toaster(toastr);
  }

  onConfirmClick(): void {


    if (!!this.data.complaint_id) {



      let RequestedObject = {
        "complaint_id": this.data.complaint_id
      }
      this.genericService.action("admin/delete-complaint", 'POST', RequestedObject).subscribe(
        RespData => {
          if (RespData.statusCode == 200) {
            this.toaster.showMessage("Lead Deleted Success", "", "success")
            this.dialogRef.close(true)
          } else {
            this.toaster.showMessage("Can't Delete Lead!", "", "error")
            this.dialogRef.close(false)
          }

        }
      );

    } else {
      this.data.status = false

      let permanentDelete = 0;
      let takeOpt: any = null;
      if (this.genericService.hasRole(['SA'])) {
        permanentDelete = 1
        takeOpt = confirm("User will permanenty deleted")
        this.data.permanant_delete = permanentDelete
        if (!takeOpt) {
          return;
        }

      }

      this.genericService.action("admin/delete-technician", 'POST', this.data).subscribe(
        RespData => {
          if (RespData.statusCode == 200) {
            if (this.data.status)
              this.toaster.showMessage("Technician Deleted", "", "success")
            this.dialogRef.close(true)
          } else {
            this.toaster.showMessage("User can't Inactive", "", "error")
            this.dialogRef.close(false)
          }
        }
      );

    }
  }




}
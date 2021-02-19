import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { GenericService } from '../../services/generic.service';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Toaster } from '../../utilities/common';
import { DeleteLeadDialog } from '../leadlist/leadlist.component';


@Component({
  selector: 'app-technician-list',
  templateUrl: './technician-list.component.html',
  styleUrls: ['./technician-list.component.css']
})
export class TechnicianListComponent implements OnInit {

  public techniciansList: any = [];
  public searchText: any;
  public selectedText: any;
  public toaster: Toaster;
  isChecked: boolean = false;
  public static technicianListCom :  TechnicianListComponent
  p:number=1;

  constructor(public route: Router,
    public activateRoute:ActivatedRoute,
    public genericService: GenericService,
    public toastr: ToastrManager,
    public dialog: MatDialog) {
    this.toaster = new Toaster(toastr);
  }

  ngOnInit() {


    // get complaints
    this.genericService.action("admin/get-technician-list", 'GET').subscribe(
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

    TechnicianListComponent.technicianListCom = this
  }

  goToLeads(id:any){
    //  { relativeTo: this.route }
    this.route.navigate(['view-leads/'+id], { relativeTo: this.activateRoute });
    
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


  
  deleteTechinician(objToDelete,index:number) {
    
    const dialogRef = this.dialog.open(DeleteLeadDialog,{
      data : objToDelete
    });
    
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.techniciansList.splice(index,1)
      }
    });

  }


  viewTechnician(dataObj:any) {
    console.log(dataObj)
     this.dialog.open(ViewTechnicianDialog, { data:dataObj });
  }

}




@Component({
  selector: 'view-technician-dialog',
  templateUrl: 'view-technician-dialog.html',
})
export class ViewTechnicianDialog {
  constructor(
    public dialogRef: MatDialogRef<ViewTechnicianDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router:Router) {
      console.log(data)
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  goToLeads(id:any){
    // this.router.navigate(['view-leads/'+id])
    TechnicianListComponent.technicianListCom.goToLeads(id);
    this.dialogRef.close()
  }

 }

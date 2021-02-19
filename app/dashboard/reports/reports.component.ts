import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { GenericService } from 'src/app/services/generic.service';
import { Toaster } from 'src/app/utilities/common';
// import * as $ from 'jquery';
// import { daterangepicker } from 'jquery';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  public leadList: any = [];
  public searchText: any;
  public selectedText: any;
  public static currentToUpdateStatus: any;
  public toaster: Toaster;
  p: number = 1;

  filterForm: FormGroup;

  leadsControl = new FormControl();



  constructor(
    public genericService: GenericService,
    public toastr: ToastrManager,
    public dialog: MatDialog,
    public activateRoute: ActivatedRoute,
    public fb: FormBuilder) {
    this.toaster = new Toaster(toastr);
  }


  isForPerticularTechnician = false;
  Neww = 0;
  completedd = 0;
  pendingg = 0;
  failedd = 0;

  leadsFilters: any[] = [
    { id: 1 ,   desc: "Company Name", value: "company_name", isActive: false },
    { id: 2 ,  desc: "Customer Name", value: "customer_name", isActive: false },
    { id: 3 ,  desc: "Dates (Start - End)", value: "dates", isActive: false },
    { id: 3 ,  desc: "Get Exact Date", value: "exactDate", isActive: false },
    { id: 4 ,  desc: "New", value: "new", isActive: false },
    { id: 5 ,  desc: "Pending", value: "pending", isActive: false },
    { id: 6 ,  desc: "Completed", value: "completed", isActive: false },
    { id: 7 ,  desc: "Failed", value: "failed", isActive: false }
  ];

  areFiltersApplied:boolean = false;
  ngOnInit() {


    // $(function() {
    //   $('input[name="daterange"]').daterangepicker({
    //     opens: 'left'
    //   }, function(start, end, label) {
    //     console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    //   });
    // });



    this.filterForm = this.fb.group({
      company_name: [null],
      customer_name: [null],
      dates: this.fb.group({
        startDate: '',
        endDate: ''
      }),
      exactDate: [null],
      new: [0],
      completed: [1],
      pending: [2],
      failed: [3]
    })

  }





  onSelectFilter(index) {
    // console.log(event.value)

    this.leadsFilters.map(d => d['isActive'] = false);
    let frmValue = null;
    this.areFiltersApplied = false;
    this.filterForm.clearValidators();
    this.filterForm.reset();
    index.value.map((d: any) => {
      this.areFiltersApplied = true;
      this.leadsFilters[d].isActive = true
      frmValue = this.leadsFilters[d].value;
      this.filterForm.controls[frmValue].setValidators(this.leadsFilters[d].setValue);
      this.filterForm.controls[frmValue].setValidators([Validators.required]);
      this.filterForm.controls[frmValue].updateValueAndValidity();
    })


    // this.leadsFilters[index].isActive = true;

    // this.leadsFilters.map(d => { d.value == element.value ? d.isActive = true : d.isActive = false; return d; });

    console.log(index);
  }


  public hasError = (controlName: string, errorName: string) => {
    return this.filterForm.controls[controlName].hasError(errorName);
  }

  getFilterResults() {
    let obj = this.filterForm.value;

    // get all complaints
    this.genericService.action("admin/get-report-filter", 'POST', obj).subscribe(
      RespData => {
        if (RespData.statusCode == 200) {
          let d = RespData.respData;
          d.sort((a, b) => (a.complaint_id < b.complaint_id) ? 1 : -1)

          this.leadList = d;

          console.log(this.leadList)
        } else {
          alert(RespData.statusMessage);
        }
      }
    );

  }

  exportLeads() {

  }




}


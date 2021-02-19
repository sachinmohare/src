import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Toaster } from '../utilities/common';
import { UrlConfig } from '../utilities/url.config';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { MatAutocomplete } from '@angular/material';
import { Router } from '@angular/router';
import { GenericService } from '../services/generic.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { StockAutoComplete } from '../utilities/customautocomplete.component';
import { startWith, map } from 'rxjs/operators';

import { ExcelService } from '../services/excel.service';
import { shareData } from '../services/shareData.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  public toaster: Toaster;
  private urlConfig: UrlConfig;
  
  public model:any = {};
  minDate : any;
  public itemInvlCtrl = new FormControl();//formcontrol element for persons involved input box
  public filterStockList : Observable<any[]>;
  public separatorKeysCodes: number[] = [ENTER, COMMA];//chip seperator 

  
  @ViewChild('itemInvInput') itemInvInput: ElementRef<HTMLInputElement>;//input element for item involved
  @ViewChild('itemInvlAuto') itemInvlAuto: MatAutocomplete; //auto complete for item involved

  constructor(private router: Router, private genericService: GenericService,public toastr: ToastrManager,
    public autocomplete: StockAutoComplete,private excelService:ExcelService,private dataService:shareData) {
    this.toaster = new Toaster(toastr);
    this.urlConfig = new UrlConfig();
   
   
    this.filterStockList = this.itemInvlCtrl.valueChanges.pipe(
      startWith(null), map((stock: string | null) => stock ? autocomplete.filter(stock, this.model.stockList, 'name') : this.model.stockList.slice())
      )
    
  }
  ngOnInit() {
    this.model={
      report:{name:"",fromDate:"",toDate:""},
      stockList :[],
    selectStockList:[],
    reportList:[],
    update:false,
    today : new Date(),
    view: { //autocomplete common config
      autocomplete: {
        visible: true,
        selectable: true,
        removable: true,
        addOnBlur: true
      }
    }
  };
  this.home();
  }
  home(){
    // let url:string = this.urlConfig.CONFIG.STOCK.HOME_PAGE; 
    // let request:RequestObject = new RequestObject(url,this.reqtype.TYPE.GET, null, null);
    // let response = this.genericService.action(request).subscribe(
    //   response =>{
    //     this.model.stockList = response.listObject;         
    //   },
    //   error =>{
    //     this.toaster.showMessage("Oops.! Something went wrong..!!","Error!","error");
    //     console.log(error);
    //   }
    // );
  }

  getReport(){


    this.model.selectStockList.forEach(per => {
      this.model.report.name = per.name;
    });

    //set date time
    if(this.model.report.fromDate){
    let d=new Date(this.model.report.fromDate);
    d.setDate(d.getDate()-1);
    d.setHours(0,0,0,0);
    this.model.report.fromDate =d;
    }

    if(this.model.report.toDate){
    let td=new Date(this.model.report.toDate);
    td.setHours(0,0,0,0);
    this.model.report.toDate =td;
    }

    // let url:string = this.urlConfig.CONFIG.REPORT;
    // let request= new RequestObject(url,this.reqtype.TYPE.POST, this.model.report, null);
    // let response = this.genericService.action(request).subscribe(
    //   response =>{
    //       this.model.reportList = response.listObject;
    //      this.clearAll(); 
    //   },
    //   error =>{
    //     this.clearAll();
    //     this.toaster.showMessage(error.message,"Error!","error");
    //     console.log(error);
    //   }
    // );
  }

  clearAll(){
   this.model.report={}; 
   this.model.selectStockList=[];
  }

  setMinDate(date){
    if(date){
   let d = date.setDate(date.getDate() + 1);
   this.minDate = new Date(d);
  }
  }

  exportToExcel(){
    let data = [];
    let i=1;
    if(this.model.reportList){
      this.model.reportList.forEach(row => {
        let d=new Date(row.date);
        let obj = {"Sr.No":i,"Item Name":row.name,"Date":d,
                    "Part No.":row.partNumber,"Finished Part No.":row.finishItemNumber,
                  "Primary Weight":row.primaryWeight,"Finished weight":row.finishWeight,"Total Cost":row.totalCost};
        
        data.push(obj);
        ++i;
      })
      this.excelService.exportAsExcelFile(data, 'STOCK', 'A-H');
    }
  }

  updateStock(row){
    this.dataService.setData(row);
    this.router.navigate(['dashboard/inventory-master']);
  }
}

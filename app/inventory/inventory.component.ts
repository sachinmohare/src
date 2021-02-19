import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Toaster } from '../utilities/common';
import { UrlConfig } from '../utilities/url.config';
import { Router } from '@angular/router';
import { GenericService } from '../services/generic.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocomplete } from '@angular/material';
import { StockAutoComplete } from '../utilities/customautocomplete.component';
import { shareData } from '../services/shareData.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  public toaster: Toaster;
  private urlConfig: UrlConfig;
  
  public model:any = {};

  public itemInvlCtrl = new FormControl();//formcontrol element for persons involved input box
  public filterStockList : Observable<any[]>;
  public separatorKeysCodes: number[] = [ENTER, COMMA];//chip seperator 

  
  @ViewChild('itemInvInput') itemInvInput: ElementRef<HTMLInputElement>;//input element for item involved
  @ViewChild('itemInvlAuto') itemInvlAuto: MatAutocomplete; //auto complete for item involved


constructor(private router: Router, private genericService: GenericService,public toastr: ToastrManager,
  public autocomplete: StockAutoComplete,private dataService:shareData) {
    this.toaster = new Toaster(toastr);
    this.urlConfig = new UrlConfig();
   
   
    this.filterStockList = this.itemInvlCtrl.valueChanges.pipe(
      startWith(null), map((stock: string | null) => stock ? autocomplete.filter(stock, this.model.stockList, 'name') : this.model.stockList.slice())
      )
    
  }

  ngOnInit() {
  this.model={
   inventory :{ id:"",finishItemNumber:"",date:"",partNumber:"",primaryWeight:"",finishWeight:""
   ,totalCost:"",stockId:"",
   stockItem:{id:"" ,productId :"", name : "",status : "" }
  },
   stockList :[],selectStockList:[],update:false,
   errorMessage :{partNumber:"Enter Part Number",finishItemNumber:"Enter finish Item Number",primaryWeight:"Enter primary Weight",
   finishWeight:"Enter Finish Weight",totalCost:"Enter Total Cost",},
   view: { //autocomplete common config
    autocomplete: {
      visible: true,
      selectable: true,
      removable: true,
      addOnBlur: true
    }
  },
  today : new Date()
  };
  // this.home();

  let data= this.dataService.getData();
    if(data){
      this.model.update=true;
      this.model.inventory.id=data.id;
      this.model.inventory.finishItemNumber=data.finishItemNumber;
      this.model.inventory.date=data.date;
      this.model.inventory.partNumber=data.partNumber;
      this.model.inventory.primaryWeight=data.primaryWeight;
      this.model.inventory.finishWeight=data.finishWeight;
      this.model.inventory.totalCost=data.totalCost;

      this.model.inventory.stockItem.id=data.stockId;
      this.model.inventory.stockItem.name=data.name;
      this.model.inventory.stockItem.productId=data.productId;
      this.model.inventory.stockItem.status=data.status;

      this.model.selectStockList.push(this.model.inventory.stockItem);
      this.dataService.setData(null);
    }
  }
  
  // home(){
  //   let url:string = this.urlConfig.CONFIG.STOCK.HOME_PAGE; 
  //   let request:RequestObject = new RequestObject(url,this.reqtype.TYPE.GET, null, null);
  //   let response = this.genericService.action(request).subscribe(
  //     response =>{
  //       this.model.stockList = response.listObject;         
  //     },
  //     error =>{
  //       this.toaster.showMessage("Oops.! Something went wrong..!!","","error");
  //       console.log(error);
  //     }
  //   );
  // }

  save(){
    
  }

  clearAll(){
    this.model.inventory ={};
    this.model.selectStockList=[];
    this.model.update=false;
  }

  // public save(){
  //   var request:RequestObject ;

  //   this.model.selectStockList.forEach(per => {
  //     this.model.inventory.stockId = per.id;
  //   });

  //   //set date time
  //   let d=new Date(this.model.inventory.date);
  //   d.setHours(0,0,0,0);
  //   this.model.inventory.date =d;

  //   if(this.model.update){
  //     let url:string = this.urlConfig.CONFIG.INVENTORY.UPDATE;
  //     // request= new RequestObject(url,this.reqtype.TYPE.PUT, this.model.inventory, null);
  //   }
  //   else if(!this.model.update){
  //     // let url:string = this.urlConfig.CONFIG.INVENTORY.UPDATE;
  //     // request = new RequestObject(url,this.reqtype.TYPE.POST, this.model.inventory, null);
  //   }

  //   let response = this.genericService.action(request).subscribe(
  //     response =>{
  //         this.toaster.showMessage(response.message,"","success");
  //        this.clearAll(); 
  //        this.home();
  //       this.model.update=false;
  //     },
  //     error =>{
  //       this.clearAll();
  //       this.toaster.showMessage(error.message,"","error");
  //       console.log(error);
  //     }
  //   );
  // }

}

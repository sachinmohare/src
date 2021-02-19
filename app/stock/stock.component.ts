import { Component, OnInit } from '@angular/core';
import { Toaster } from '../utilities/common';
import {  UrlConfig } from '../utilities/url.config';
import { ToastrManager } from 'ng6-toastr-notifications';
import { GenericService } from '../services/generic.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  public toaster: Toaster;
  private urlConfig: UrlConfig;
  
  public model:any = {};


  constructor(private router: Router, private genericService: GenericService,public toastr: ToastrManager) {
    this.toaster = new Toaster(toastr);
    this.urlConfig = new UrlConfig();
   
   }
   
  ngOnInit() {
    this.model=
    {
      stock :{id:"" ,productId :"", name : "",status : ""},
    stockList :[],update : false,
    errorMessage:{name:"Length should be min. 2 and max. 60",productId :"Enter Product Number"},
  }
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
    //     this.toaster.showMessage("Oops.! Something went wrong..!!","","error");
    //     console.log(error);
    //   }
    // );
  }
 
  clearAll(){
    this.model.stock ={};
    this.model.update = false;
  }

  public save(){

    // var request:RequestObject ;
    // if(this.model.update){
    //   let url:string = this.urlConfig.CONFIG.STOCK.UPDATE;
    //   request= new RequestObject(url,this.reqtype.TYPE.PUT, this.model.stock, null);
    // }
    // else if(!this.model.update){
    //   let url:string = this.urlConfig.CONFIG.STOCK.UPDATE;
    //   request = new RequestObject(url,this.reqtype.TYPE.POST, this.model.stock, null);
    // }

    // let response = this.genericService.action(request).subscribe(
    //   response =>{
    //     if(response.status=="error" && response.code=="500"){
    //       this.toaster.showMessage(response.message,"","warn");
    //     }
    //    else if(response.status=="success" && response.code=="200"){
    //       this.toaster.showMessage(response.message,"","success");
    //       this.model.stock = {};//response.object;
    //      this.clearAll();
    //      this.home();
    //     this.model.update=false;
    //     }
    //   },
    //   error =>{
    //     this.toaster.showMessage(error.message,"","error");
    //     console.log(error);
    //   }
    // );
  }

  edit(row : any){
    this.model.stock = row;
    this.model.update = true;
  }

  delete(row : any){
  //   let url:string = this.urlConfig.CONFIG.STOCK.DELETE +row.id;

  //   let request = new RequestObject(url,this.reqtype.TYPE.DELETE,null, null);
  //   this.genericService.action(request).subscribe(
  //     response => { 
  //       this.toaster.showMessage(response.message,"","success");
  //       this.home();
  //     },error => {
  //         this.toaster.showMessage("Oops.! Something went wrong..!!","","error");
  //         console.log(error);
  //     });
  // }
}
}
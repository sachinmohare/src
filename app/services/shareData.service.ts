import { Injectable } from '@angular/core';


@Injectable()
export class shareData {

  public data: any;

  constructor() { }

  setData(obj: any) {
    this.data = obj;
  }

  getData() {
    return this.data;
  }

  
}
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  public serviceInitialized = new BehaviorSubject<boolean>(false);
  public loader = this.serviceInitialized.asObservable();

  public serviceCustomLoader = new BehaviorSubject<boolean>(true);
  public customLoader = this.serviceCustomLoader.asObservable();

  hideCustomLoader(data){
    this.serviceCustomLoader.next(data);
     data ?  this.serviceInitialized.next(false):this.serviceInitialized.next(true);
  }

  showLoader(){
    this.serviceInitialized.next(true);
  }

  hideLoader(){ 
    this.serviceInitialized.next(false);
  }
}

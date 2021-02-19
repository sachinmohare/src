import { MatAutocompleteSelectedEvent, MatChipInputEvent } from "@angular/material";
import { FormControl } from "@angular/forms";
import { Injectable } from "@angular/core";

@Injectable()
export class StockAutoComplete{
  
    //method to clear text box
    public clear(event: MatChipInputEvent, ctrl:FormControl): void {
    
    const input = event.input;
    const value = event.value;
   
    input.value = '';
    ctrl.setValue(null);
  
}

    //remove specific  chip
public remove(obj: any, list:any[]): void {
    const index = list.indexOf(obj);

    if (index >= 0) {
      list.splice(index, 1);
    }
  }

  //select elemet and add as chip
  public select(event: MatAutocompleteSelectedEvent, list:any[],inputelem:HTMLInputElement,ctrl:FormControl, isSingle:boolean): void {
    let obj = event.option.value;
    if(isSingle){
      list[0] = obj;
      inputelem.value = '';//clear input 
      ctrl.setValue(null);//clear input 
    }else {
      //check by id
      let found = list.find(elem => elem.id == obj.id);
      if(list.indexOf(obj) == -1 && !found){
        list.push(obj);//add  to selected  list
        inputelem.value = '';//clear input 
        ctrl.setValue(null);//clear input 
      }
    }
  }

  //filter  list
  public filter(obj: any, list:any[], filtercolumn:string): string[] {
    if(typeof(obj) == 'string'){
      const filterValue = obj.toLowerCase();
      return list.filter(f => f[filtercolumn].toLowerCase().indexOf(filterValue) === 0);
    }else{
      return list;
    }
  }

}
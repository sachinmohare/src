import { ToastrManager } from "ng6-toastr-notifications";

export class Toaster{
	constructor(public toastr: ToastrManager){}
    
	public showMessage(msg:string,title:string,type:string){
		switch(type){
			case "success":
				this.toastr.successToastr(msg,title);
			break;
			case "error":
				this.toastr.errorToastr(msg,title);
			break;
			case "info":
				this.toastr.infoToastr(msg,title);
			break;
			case "warn":
				this.toastr.warningToastr(msg,title);
			break;
		}
	}
}
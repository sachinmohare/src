import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/internal/Observable";
import { GenericService } from "../../services/generic.service";

@Injectable()
export class GetTechnicianByIdResolver implements Resolve<any> {
    constructor(
        private genericService: GenericService
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        return this.genericService.action('get-technician-by-id','POST',{technician_id:route.params.id});
    }
}

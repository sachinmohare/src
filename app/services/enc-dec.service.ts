import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { Observable } from "rxjs";
import 'rxjs/add/operator/map';


@Injectable()
export class UserService {

    constructor(private http: HttpClient,) {

    }

    setUser(obj) {
        localStorage.setItem("current_user", JSON.stringify(obj));
    }

    getUser(){
        return JSON.parse(localStorage.getItem("current_user"));
    }

}

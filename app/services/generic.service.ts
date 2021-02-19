import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import { environment } from "src/environments/environment";


@Injectable()
export class GenericService {

  constructor(private http: HttpClient) {

  }

  public action(url: string, type: string, body = null): Observable<any> {

    url = environment.BASE_API_URL + '' + url;
    let response: Observable<any> = null;
    // console.log(url)
    let header =
      new HttpHeaders({
        'Content-Type': 'application/json',
        'commtext': 'TCDS_123!!'
      });

    console.log(url);

    switch (type) {
      case "GET":
        response = this.http.get<any>(url, { headers: header });
        break;
      case "POST":
        console.log("post", body)
        response = this.http.post<any>(url, body, { headers: header });
        break;
      case "PUT":
        response = this.http.put<any>(url, body, { headers: header });
        break;
      case "DELETE":
        response = this.http.delete<any>(url, { headers: header });
        break;
    }
    return response;
  }

  // public login(config:RequestObject,params:HttpParams):Observable<any>{
  //   let headers:HttpHeaders = config.headers;
  //   let response:Observable<any> = null;
  //   response = this.http.post(url, config.data, {headers:headers, params : params});
  //   return response;
  // }

  // Refresh Access Token
  refreshtoken() {
    localStorage.setItem("login", "true");
    var token = localStorage.getItem('refresh_token');
    var data = "?refresh_token=" + token + "&grant_type=refresh_token";
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'Authorization': 'Basic ' + btoa("stockmanagement:RxqI1a") });
    return this.http.post(data, null, { headers: reqHeader })
      .map(res => {
        const newAccessToken = res['access_token'];
        const newRefreshToken = res['refresh_token'];
        // Store New Token
        localStorage.setItem('refresh_token', newRefreshToken);
        localStorage.setItem('access_token', newAccessToken);
        localStorage.removeItem("login");
        return res;
      });
  }


  hasRole(roles: any = []) {
    let roleDesc = this.getUserRole();
    let flag: boolean = false;

    for (let i = 0; i < roles.length; i++) {
      let element = roles[i]
      if (element == roleDesc) {
        flag = true;
        break;
      } else {
        flag = false
      }
    }
    return flag;
  }

  getUserRole(): any {
    let obj = JSON.parse(localStorage.getItem("current_user"));
    return obj.user_role.role_desc;
  }

  getUserData(): any {
    let obj = JSON.parse(localStorage.getItem("current_user"));
    return obj;
  }
}

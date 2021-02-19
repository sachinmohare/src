import { HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { GenericService } from "../services/generic.service";
import { throwError as observableThrowError, Observable, BehaviorSubject } from 'rxjs';
import { take, filter, catchError, switchMap, finalize, tap } from 'rxjs/operators';
import { LoaderService } from "../utilities/loader/loader.service";
import { UserService } from "./enc-dec.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    isRefreshingToken: boolean = false;
    private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    private count: number = 0;
    constructor(private injector: Injector,public userService:UserService ,private router: Router, private loaderService: LoaderService) {
    }

    addToken(req: HttpRequest<any>): HttpRequest<any> {
        let user = this.userService.getUser();
        req = req.clone({ setHeaders: { authkey: user.user_token } });
        return req;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let login = !!localStorage.getItem("current_user");
        this.loaderService.show();
        this.count++;
        if ((login == true))
            req = this.addToken(req);

        req.clone({ setHeaders: { commtext: 'secrete' } });

        return next.handle(req).pipe(finalize(() => {
            this.count--;
            if (this.count <= 0) {
                this.loaderService.hide();
                this.count = 0;
            }
        }
        ), catchError(error => {
            if (error.error.error == "invalid_token") {
                return this.handle401Error(req, next)
            } else {
                return observableThrowError(error);
            }
        }

        ))
    }


    handle400Error(error) {
        if (error && error.status === 400 && error.error && error.error.error === 'invalid_grant') {
            // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
            return this.logoutUser();
        }

        return observableThrowError(error);
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;

            // Reset here so that the following requests wait until the token
            // comes back from the refreshToken call.
            this.tokenSubject.next(null);

            const authService = this.injector.get(GenericService);

            return authService.refreshtoken().pipe(
                switchMap((newToken: string) => {
                    if (newToken) {
                        localStorage.setItem("access_token", newToken['access_token'])
                        req = this.addToken(req);
                        return next.handle(req);
                    }
                    // If we don't get a new token, we are in trouble so logout.
                    return this.logoutUser();
                }),
                catchError(error => {
                    // If there is an exception calling 'refreshToken', bad news so logout.
                    return this.logoutUser();
                }),
                finalize(() => {
                    this.isRefreshingToken = false;
                }));
        } else {
            return this.tokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(token => {
                    localStorage.setItem("access_token", token['access_token'])
                    return next.handle(this.addToken(req));
                }));
        }
    }

    logoutUser() {
        // Route to the login page (implementation up to you)
        this.router.navigate(['/authentication/login']);
        return Observable.throw("");
    }

}
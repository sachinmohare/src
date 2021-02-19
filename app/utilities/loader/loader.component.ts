import { Component } from "@angular/core";
import { LoaderService } from "./loader.service";
import { Subject } from "rxjs";

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.css'],
  })
export class LoaderComponent{
    color = 'primary';
    mode = 'indeterminate';
    value = 50;
    isLoading: Subject<boolean>;
    constructor(private loaderService: LoaderService) {
        this.isLoading = this.loaderService.isLoading;
    }
}
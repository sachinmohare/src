
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppBlankComponent } from './app-blank-component/app-blank-component.component';
import { LoginComponent } from './login/login.component';

import { ErrorComponent } from './authentication/error/error.component';

import { LoaderComponent } from './utilities/loader/loader.component';
import { ExcelService } from './services/excel.service';
import { DatePipe, LocationStrategy, CommonModule, PathLocationStrategy, HashLocationStrategy } from '@angular/common';
import { TokenInterceptor } from './services/interceptor.service';

import { LoaderService } from './utilities/loader/loader.service';
import { GenericService } from './services/generic.service';
import { StockAutoComplete } from './utilities/customautocomplete.component';

import { shareData } from './services/shareData.service';
import { NumberDirective } from './numberOnlyPipe';
import { CapitalizeFirstPipe } from './capitalFirst';
import { UserService } from './services/enc-dec.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InventoryComponent } from './inventory/inventory.component';
import { ReportComponent } from './report/report.component';
import { StockComponent } from './stock/stock.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app.routing';

@NgModule({
  declarations: [
    AppComponent,
    AppBlankComponent,
    LoginComponent,
    ErrorComponent,
    LoaderComponent,
    NumberDirective,
    CapitalizeFirstPipe,
    InventoryComponent,
    ReportComponent ,
    StockComponent,
    RegisterComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    ExcelService,
    DatePipe,
    GenericService,
    shareData,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: MatDialogRef,
      useValue: {}
    },
    UserService,
    StockAutoComplete,
    LoaderService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }

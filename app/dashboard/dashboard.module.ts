import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AddcompanyComponent, GetRegisterTypeDialog } from './addcompany/addcompany.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';
import { AdminSharedService } from './services/admin-shared.service';
import { CommonModule } from '@angular/common';
import { editadmin, editLeadadmin } from './models/adminModel';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DeleteLeadDialog, LeadlistComponent, MatDialogStatus, TimeFormat, ViewLeadDialog } from './leadlist/leadlist.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import { GetLeadByIdResolver } from './addcompany/get-lead-data';
import { AddTechnicianComponent } from './add-technician/add-technician.component';
import { TechnicianListComponent, ViewTechnicianDialog } from './technician-list/technician-list.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { shareData } from '../services/shareData.service';
import { GetTechnicianByIdResolver } from './add-technician/get-technician-data';
import { GetLeadByTechnicianIdResolver } from './leadlist/get-technician-wise-lead-data';
import { ReportsComponent } from './reports/reports.component';
import { ProfileComponent } from './profile/profile.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { GetProfieResolver } from './profile/get-profile-data';
import { ManageUsersComponent } from './manage-users/manage-users.component';
 

@NgModule({
  imports: [
    DashboardRoutingModule,
    CommonModule,
    SharedModule,
    AutocompleteLibModule,
    MatAutocompleteModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    MatDialogModule,
    MatSlideToggleModule,
    NgCircleProgressModule.forRoot({})
  ],
  declarations: [
    DashboardComponent,
    AddcompanyComponent,
    LeadlistComponent,
    MatDialogStatus,
    ViewLeadDialog,
    ViewTechnicianDialog,
    DeleteLeadDialog,
    TimeFormat,
    AddTechnicianComponent,
    TechnicianListComponent,
    GetRegisterTypeDialog,
    ReportsComponent,
    ProfileComponent,
    ManageUsersComponent
  ],
  providers:[
    {
      provide: MatDialogRef,
      useValue: {}
    },
    AdminSharedService,editadmin,editLeadadmin,GetLeadByIdResolver,GetTechnicianByIdResolver,GetLeadByTechnicianIdResolver,GetProfieResolver
  ],
  entryComponents:[
    MatDialogStatus,
    ViewLeadDialog,
    DeleteLeadDialog,
    GetRegisterTypeDialog,
    ViewTechnicianDialog
  ]
})
export class DashboardModule { }

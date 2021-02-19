import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddTechnicianComponent } from './add-technician/add-technician.component';
import { GetTechnicianByIdResolver } from './add-technician/get-technician-data';
import { AddcompanyComponent } from './addcompany/addcompany.component';
import { GetLeadByIdResolver } from './addcompany/get-lead-data';
import { DashboardComponent } from './dashboard.component';
import { GetLeadByTechnicianIdResolver } from './leadlist/get-technician-wise-lead-data';
import { LeadlistComponent } from './leadlist/leadlist.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { GetProfieResolver } from './profile/get-profile-data';
import { ProfileComponent } from './profile/profile.component';
import { ReportsComponent } from './reports/reports.component';
import { TechnicianListComponent } from './technician-list/technician-list.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'add-lead', component: AddcompanyComponent },
      { path: 'view-leads', component: LeadlistComponent },
      { path: 'view-leads/edit-lead/:leadId',component:AddcompanyComponent,resolve:{
        leadData: GetLeadByIdResolver
       } },
      { path: 'add-technician', component: AddTechnicianComponent },
      { path: 'view-technicians', component: TechnicianListComponent },
      { path: 'view-technicians/edit-technicians/:id',component:AddTechnicianComponent,resolve:{
        technicianData: GetTechnicianByIdResolver
       } 
      },
      { 
        path: 'view-technicians/view-leads/:id', component: LeadlistComponent, resolve:{
        technicianData: GetLeadByTechnicianIdResolver} 
      },
      { 
        path: 'view-technicians/view-leads/:id/edit-lead/:leadId', component: AddcompanyComponent, resolve:{
          leadData: GetLeadByIdResolver} 
      },
      { 
        path: 'manage-users', component: ManageUsersComponent 
      },
      { path: 'report-master', component: ReportsComponent },
      { path: 'profile', component: ProfileComponent,resolve:{
        profileData: GetProfieResolver
       } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

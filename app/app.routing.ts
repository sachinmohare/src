import { Routes,RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NgModule } from '@angular/core';

export const AppRoutes: Routes = [

    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
    path : 'login',
    component : LoginComponent
    },
    {
        path : 'tcds-registration',
        component : RegisterComponent
    },
    {
        path: 'dashboard',
        loadChildren:'./dashboard/dashboard.module#DashboardModule'
    },
    {
        path: '**',
        redirectTo: 'authentication/404'
      }
];


@NgModule({
    imports: [RouterModule.forRoot(AppRoutes, { scrollPositionRestoration: 'top', useHash: true })],
    // 'imports: [RouterModule.forRoot(AppRoutes,{scrollPositionRestoration: 'top', useHash: false})],
    exports: [RouterModule]
  })

  export class AppRoutingModule { }
  
// export const routes: ModuleWithProviders = 
// RouterModule.forRoot(AppRoutes,
//     { enableTracing: true, useHash:true,scrollPositionRestoration: 'enabled' }
    // );

    // RouterModule.forRoot(AppRoutes,{scrollPositionRestoration: 'top', useHash: false})

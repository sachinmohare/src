import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ng6-toastr-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DemoMaterialModule } from '../demo-material-module';
import { shareData } from '../services/shareData.service';
import { MatChipsModule, MatDatepickerModule, MatInputModule, MatNativeDateModule, MatRadioModule, MatSidenavModule } from '@angular/material';

@NgModule({
  imports: [

    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    MatNativeDateModule,
    MatInputModule,
    MatDatepickerModule,
    
    ReactiveFormsModule,
    MatSidenavModule,
    DemoMaterialModule,
    MatChipsModule,
   
  ],
  exports:[
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    MatChipsModule,
    MatRadioModule
  ],
  providers:[
    
  ],
  declarations: []
})
export class SharedModule { }

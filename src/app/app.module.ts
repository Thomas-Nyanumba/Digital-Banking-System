import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Auth/Components/login/login.component';
import { ViewAccountsComponent } from './Customer/Components/view-accounts/view-accounts.component';
import { ViewStatementsComponent } from './Customer/Components/view-statements/view-statements.component';
import { DepositsComponent } from './Customer/Components/deposits/deposits.component';
import { WithdrawalsComponent } from './Customer/Components/withdrawal/withdrawal.component';
import { TransferFundsComponent } from './Customer/Components/transfer-funds/transfer-funds.component';
import { DashboardComponent } from './Customer/Components/dashboard/dashboard.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ViewAccountsComponent,
    ViewStatementsComponent,
    TransferFundsComponent,
    DashboardComponent,
    DepositsComponent,
    WithdrawalsComponent
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule, 
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

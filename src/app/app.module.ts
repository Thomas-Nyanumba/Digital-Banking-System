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
import { DepositComponent } from './Customer/Components/deposits/deposits.component';
import { WithdrawalComponent } from './Customer/Components/withdrawal/withdrawal.component';
import { TransferFundsComponent } from './Customer/Components/transfer-funds/transfer-funds.component';
import { DashboardComponent } from './Customer/Components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ViewAccountsComponent,
    ViewStatementsComponent,
    DepositComponent,
    WithdrawalComponent,
    TransferFundsComponent,
    DashboardComponent
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

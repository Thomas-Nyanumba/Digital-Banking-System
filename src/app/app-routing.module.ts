import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Auth/Components/login/login.component';
import { ViewAccountsComponent } from './Customer/Components/view-accounts/view-accounts.component';
import { ViewStatementsComponent } from './Customer/Components/view-statements/view-statements.component';
import { DepositComponent } from './Customer/Components/deposits/deposits.component';
import { WithdrawalComponent } from './Customer/Components/withdrawal/withdrawal.component';
import { TransferFundsComponent } from './Customer/Components/transfer-funds/transfer-funds.component';
import { AuthGuard } from './Auth/Guards/auth.guard';
import { DashboardComponent } from './Customer/Components/dashboard/dashboard.component';
// import { DashboardComponent } from './Components/dashboard/dashboard.component'; // Make sure you import DashboardComponent correctly

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'view-accounts', component: ViewAccountsComponent}, // ✅ Protected
  { path: 'view-statements', component: ViewStatementsComponent },
  { path: 'deposits', component: DepositComponent},
  { path: 'withdrawal', component: WithdrawalComponent},
  { path: 'transferfunds', component: TransferFundsComponent}



  // { path: 'dashboard', component: DashboardComponent },  // Add this route for dashboard
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

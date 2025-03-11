import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userName: string = 'Thomas';
  
  // Example data - in reality, you'd fetch from a service
  mainAccountBalance: number = 125000;
  savingsBalance: number = 50000;
  pendingPayments: number = 3;

  recentTransactions = [
    { date: 'Today', type: 'Transfer', recipient: 'James M.', amount: -5000, status: 'Success' },
    { date: 'Yesterday', type: 'Top Up', recipient: 'M-Pesa', amount: 3000, status: 'Success' },
    { date: 'Monday', type: 'Bill Payment', recipient: 'Kenya Power', amount: -2500, status: 'Pending' }
  ];

  savingsGoals = [
    { goal: 'Vacation Fund', icon: '🌴', progress: 60, target: 100000 },
    { goal: 'Emergency Fund', icon: '🚑', progress: 80, target: 50000 }
  ];

  constructor() { }

  ngOnInit(): void {
    // You could load data from a service here
  }

  sendMoney() {
    alert('Redirecting to Send Money...');
  }

  payBills() {
    alert('Redirecting to Pay Bills...');
  }

  topUp() {
    alert('Redirecting to Top Up...');
  }

  requestLoan() {
    alert('Redirecting to Request Loan...');
  }

}

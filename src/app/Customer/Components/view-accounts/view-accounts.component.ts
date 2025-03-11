import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/Auth/Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-accounts',
  templateUrl: './view-accounts.component.html',
  styleUrls: ['./view-accounts.component.css']
})
export class ViewAccountsComponent implements OnInit {

  customerId: any = [];
  accounts: any[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService, // ✅ Injected here
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ Get customerId from AuthService
    const loggedInCustomerId = this.authService.getLoggedInCustomerId();

    if (loggedInCustomerId) {
      this.customerId = loggedInCustomerId;
      console.log('Logged-in Customer ID:', this.customerId);
      this.getAccounts();
    } else {
      console.error('No customerId found. Redirecting to login...');
      this.router.navigate(['/login']); // ✅ Redirect if not logged in
    }
  }

  getAccounts(): void {
    const url = `http://localhost:3001/accounts?customerId=${this.customerId}`;
    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.accounts = data;
        console.log('Fetched accounts:', this.accounts);
      },
      (error) => {
        console.error('Error fetching accounts:', error);
      }
    );
  }

}

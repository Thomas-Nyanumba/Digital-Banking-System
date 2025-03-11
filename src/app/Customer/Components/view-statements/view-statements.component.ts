import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../Services/customer.service';

@Component({
  selector: 'app-view-statements',
  templateUrl: './view-statements.component.html',
  styleUrls: ['./view-statements.component.css']
})
export class ViewStatementsComponent implements OnInit {

  transactions: any[] = [];
  accountId!: number; // Assume you are getting this from route or selection
  errorMessage: string = '';

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Get the account ID from query param or route param if passed
    this.route.params.subscribe(params => {
      this.accountId = +params['id'] || 1; // Default to account ID 1 if not provided

      this.loadTransactions();
    });
  }

  loadTransactions(): void {
    this.customerService.getTransactionsByAccountId(this.accountId)
      .subscribe({
        next: (data: any[]) => {
          this.transactions = data;
          console.log('Transactions:', data);
        },
        error: (err: any) => {
          console.error(err);
          this.errorMessage = 'Failed to load transactions.';
        }
      });
  }

}
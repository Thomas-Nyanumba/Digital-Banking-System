import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs'; // <- Don't forget this!
import { Account } from '../../Models/account.model';
import { Transaction } from '../../Models/transaction.model';
import { AccountService } from '../../Services/account.service';
import { TransactionService } from '../../Services/transaction.service';
import { AuthService } from 'src/app/Auth/Services/auth.service';

@Component({
  selector: 'app-view-statements',
  templateUrl: './view-statements.component.html',
  styleUrls: ['./view-statements.component.css']
})
export class ViewStatementsComponent implements OnInit, OnDestroy {

  userId: number = 0;
  accounts: Account[] = [];
  selectedAccountId: number | null = null;
  transactions: Transaction[] = [];

  private transactionChangeSub: Subscription | undefined;

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getLoggedInCustomerId() ?? 0;

    if (this.userId) {
      this.loadUserAccounts();

      // Subscribe to transaction changes!
      this.transactionChangeSub = this.accountService.getTransactionChangeObservable().subscribe(() => {
        console.log('Transaction change detected, reloading transactions...');
        if (this.selectedAccountId) {
          this.loadTransactions(this.selectedAccountId);
        }
      });
    } else {
      console.error('No user is currently logged in.');
    }
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.transactionChangeSub) {
      this.transactionChangeSub.unsubscribe();
    }
  }

  loadUserAccounts(): void {
    this.accountService.getAccountsByUserId(this.userId).subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        if (accounts.length > 0) {
          this.selectedAccountId = accounts[0].id; // Auto-select first account
          this.loadTransactions(this.selectedAccountId);
        }
      },
      error: (err) => {
        console.error('Failed to fetch accounts:', err);
      }
    });
  }

  onAccountSelect(accountId: number): void {
    this.selectedAccountId = accountId;
    this.loadTransactions(accountId);
  }

  loadTransactions(accountId: number): void {
    if (!accountId) return;

    this.transactionService.getTransactionsByAccountId(accountId).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
      },
      error: (err) => {
        console.error('Failed to fetch transactions:', err);
      }
    });
  }

}

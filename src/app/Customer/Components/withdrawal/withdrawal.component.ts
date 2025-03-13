import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../Services/account.service';
import { AuthService } from 'src/app/Auth/Services/auth.service';
import { Account } from '../../Models/account.model';

@Component({
  selector: 'app-withdrawals',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.css']
})
export class WithdrawalsComponent implements OnInit {

  withdrawalForm!: FormGroup;
  loggedInCustomerId!: number;
  userAccounts: Account[] = [];
  selectedAccount!: Account;
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;
  message: string | undefined;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const customerId = this.authService.getLoggedInCustomerId();
  
    if (!customerId) {
      this.errorMessage = 'User not logged in or no customer ID found.';
      console.error('No customerId found in authService!');
      return;
    }
  
    this.loggedInCustomerId = customerId;

    this.withdrawalForm = this.fb.group({
      accountId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['']
    });
  
    this.loadUserAccounts();
  }

  /**
   * Fetch user accounts based on logged-in customerId
   */
  loadUserAccounts(): void {
    if (!this.loggedInCustomerId) {
      console.error('No customer ID available to fetch accounts.');
      this.errorMessage = 'Unable to fetch accounts: no customer ID.';
      return;
    }
  
    this.accountService.getAccountsByUserId(this.loggedInCustomerId).subscribe({
      next: (accounts: Account[]) => {
        this.userAccounts = accounts;

        console.log("User accounts: ", this.userAccounts);
  
        if (!accounts || accounts.length === 0) {
          this.errorMessage = 'No accounts found for this customer.';
          console.warn('No accounts returned from server.');
        } else {
          this.errorMessage = '';
          console.log(`Loaded ${accounts.length} accounts for user ID ${this.loggedInCustomerId}`);
        }
      },
      error: (err) => {
        console.error('Failed to load customer accounts:', err);
        this.errorMessage = 'An error occurred while fetching accounts.';
      }
    });
  }

  /**
   * Handles withdrawal form submission
   */
  onWithdraw(): void {
    if (this.withdrawalForm.invalid) {
      console.log('Form is invalid');
      return;
    }
  
    this.isSubmitting = true;
  
    const accountId = this.withdrawalForm.value.accountId;
    const withdrawalAmount = this.withdrawalForm.value.amount;
    const description = this.withdrawalForm.value.description || 'Withdrawal';
  
    const selectedAccount = this.userAccounts.find(acc => acc.id === accountId);
  
    if (!selectedAccount) {
      this.errorMessage = 'Selected account not found.';
      this.isSubmitting = false;
      return;
    }
  
    if (withdrawalAmount > selectedAccount.balance) {
      this.errorMessage = 'Withdrawal amount exceeds account balance.';
      this.isSubmitting = false;
      return;
    }
  
    const newBalance = selectedAccount.balance - withdrawalAmount;
  
    // Start withdrawal process
    console.log('Starting withdrawal process:', { accountId, withdrawalAmount });
  
    this.accountService.withdrawFromAccount(accountId, newBalance).subscribe({
      next: (updatedAccount: Account) => {
        // Update local account balance
        selectedAccount.balance = updatedAccount.balance;
  
        // ptionally notify account change if you have a notifier for that
        // this.accountService.notifyAccountChange(); // Optional if you already have one
  
        //  Create withdrawal transaction
        const transaction = {
          accountId: accountId,
          amount: withdrawalAmount,
          type: 'Withdrawal',
          description: description,
          date: new Date().toISOString()
        };
  
        this.accountService.createTransaction(transaction).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.message = 'Withdrawal successful!';
            this.errorMessage = '';
  
            // Notify listeners about the transaction so statements reload!
            this.accountService.notifyTransactionChange();
  
            console.log(
              `[${new Date().toISOString()}] Withdrawal successful! Account ID: ${accountId}, Amount Withdrawn: ${withdrawalAmount}, New Balance: ${updatedAccount.balance}`
            );
  
            // Reset the form after everything succeeds
            this.withdrawalForm.reset();
          },
          error: (err) => {
            console.error('Transaction logging failed:', err);
            this.isSubmitting = false;
            this.errorMessage = 'Withdrawal completed, but failed to log transaction.';
          }
        });
      },
      error: (err: any) => {
        console.error('Withdrawal failed:', err);
        this.isSubmitting = false;
        this.errorMessage = 'Withdrawal failed. Try again later.';
      }
    });
  }
}  
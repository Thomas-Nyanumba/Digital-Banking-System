import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../Services/account.service';
import { AuthService } from 'src/app/Auth/Services/auth.service';
import { Account } from '../../Models/account.model';

@Component({
  selector: 'app-deposits',
  templateUrl: './deposits.component.html',
  styleUrls: ['./deposits.component.css']
})
export class DepositsComponent implements OnInit {

  depositForm!: FormGroup;
  loggedInCustomerId!: number; // ✅ Logged-in user ID (customerId)
  userAccounts: Account[] = []; // ✅ All accounts linked to the user
  selectedAccount!: Account; // ✅ Account selected for deposit

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
    // ✅ Get the logged-in customer ID from AuthService
    const customerId = this.authService.getLoggedInCustomerId();
  
    if (!customerId) {
      this.errorMessage = 'User not logged in or no customer ID found.';
      console.error('No customerId found in authService!');
      return; // ✅ Exit early if no ID found
    }
  
    this.loggedInCustomerId = customerId;
  
    // ✅ Initialize deposit form
    this.depositForm = this.fb.group({
      accountId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['']
    });
  
    // ✅ Fetch all accounts for this logged-in customer
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
  
    // ✅ Use query param to filter by userId
    this.accountService.getAccountsByUserId(this.loggedInCustomerId).subscribe({
      next: (accounts: Account[]) => {
        this.userAccounts = accounts;

        console.log("User accounts: ", this.userAccounts)
  
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
   * Handles deposit form submission
   */
  onDeposit(): void {
    if (this.depositForm.invalid) {
      console.log('Deposit form is invalid. Please correct the errors.');
      return;
    }
  
    this.isSubmitting = true;
  
    const accountId = this.depositForm.value.accountId;
    const depositAmount = this.depositForm.value.amount;
  
    console.log('Starting deposit process:', { accountId, depositAmount });
  
    // Find the account in userAccounts
    const selectedAccount = this.userAccounts.find(acc => acc.id === accountId);
    console.log("Selected account:", selectedAccount);
  
    if (!selectedAccount) {
      this.errorMessage = 'Selected account not found.';
      console.error('Deposit failed: Account not found for ID', accountId);
      this.isSubmitting = false;
      return;
    }
  
    const newBalance = selectedAccount.balance + depositAmount;
  
    this.accountService.depositToAccount(accountId, newBalance).subscribe({
      next: (updatedAccount: Account) => {
        this.isSubmitting = false;
        this.message = 'Deposit successful!';
        this.errorMessage = '';
  
        // Update local account balance
        selectedAccount.balance = updatedAccount.balance;
  
        console.log(
          `[${new Date().toISOString()}] Deposit successful! Account ID: ${accountId}, Amount Deposited: ${depositAmount}, New Balance: ${updatedAccount.balance}`
        );
  
        // Reset form
        this.depositForm.reset();
      },
      error: (err: any) => {
        console.error('Deposit failed:', err);
        this.isSubmitting = false;
        this.errorMessage = 'Deposit failed. Try again later.';
      }
    });
  }
}  
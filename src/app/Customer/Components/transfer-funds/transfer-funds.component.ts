import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../Services/account.service';

@Component({
  selector: 'app-transfer-funds',
  templateUrl: './transfer-funds.component.html',
  styleUrls: ['./transfer-funds.component.css']
})
export class TransferFundsComponent implements OnInit {

  transferForm: FormGroup;
  accounts: any[] = [];
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService
  ) {
    this.transferForm = this.fb.group({
      fromAccount: ['', Validators.required],
      toAccount: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts() {
    this.accountService.getAccounts().subscribe({
      next: (data: any[]) => this.accounts = data,
      error: (err: any) => console.error('Failed to load accounts:', err)
    });
  }

  onSubmit() {
    if (this.transferForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }
  
    const formValues = this.transferForm.value;
  
    // No need for parseInt here
    const fromAccountId = formValues.fromAccount;
    const toAccountId = formValues.toAccount;
    const amount = parseFloat(formValues.amount); // still fine here
  
    const fromAccount = this.accounts.find(acc => acc.id === fromAccountId);
    const toAccount = this.accounts.find(acc => acc.id === toAccountId);
  
    if (!fromAccount || !toAccount) {
      this.errorMessage = 'Invalid account selection.';
      return;
    }
  
    if (fromAccountId === toAccountId) {
      this.errorMessage = 'Cannot transfer to the same account.';
      return;
    }
  
    if (fromAccount.balance < amount) {
      this.errorMessage = 'Insufficient funds in the source account.';
      return;
    }
  
    const updatedFromAccount = { ...fromAccount, balance: fromAccount.balance - amount };
    const updatedToAccount = { ...toAccount, balance: toAccount.balance + amount };
  
    const transferPayload = {
      fromAccountId: fromAccount.id,
      toAccountId: toAccount.id,
      amount: amount,
      description: formValues.description || 'Fund Transfer'
    };
  
    this.accountService.createTransaction(transferPayload).subscribe({
      next: () => {
        this.accountService.updateAccount(updatedFromAccount).subscribe({
          next: () => {
            this.accountService.updateAccount(updatedToAccount).subscribe({
              next: () => {
                this.successMessage = 'Funds transferred successfully!';
                this.errorMessage = '';
                this.transferForm.reset();
                this.loadAccounts();
              },
              error: (err: any) => {
                console.error('Failed to update destination account:', err);
                this.errorMessage = 'Failed to update destination account balance.';
              }
            });
          },
          error: (err: any) => {
            console.error('Failed to update source account:', err);
            this.errorMessage = 'Failed to update source account balance.';
          }
        });
      },
      error: (err) => {
        console.error('Failed to record transaction:', err);
        this.errorMessage = 'Fund transfer failed.';
      }
    });
  }
}  
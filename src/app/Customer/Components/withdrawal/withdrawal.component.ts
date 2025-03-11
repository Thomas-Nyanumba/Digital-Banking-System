import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.css']
})
export class WithdrawalComponent implements OnInit {
  withdrawalForm!: FormGroup;
  accounts: any[] = [];
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.loadAccounts();
  }

  createForm() {
    this.withdrawalForm = this.fb.group({
      account: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['']
    });
  }

  loadAccounts() {
    this.http.get<any[]>('http://localhost:3001/accounts').subscribe({
      next: (data) => {
        this.accounts = data;
      },
      error: (err) => {
        console.error('Error fetching accounts:', err);
        this.errorMessage = 'Unable to load accounts. Please try again later.';
      }
    });
  }

  onSubmit() {
    if (this.withdrawalForm.invalid) {
      return;
    }

    const formData = this.withdrawalForm.value;
    const accountId = formData.account;

    const selectedAccount = this.accounts.find(acc => acc.id === parseInt(accountId, 10));

    if (!selectedAccount) {
      this.errorMessage = 'Selected account not found.';
      return;
    }

    if (selectedAccount.balance < formData.amount) {
      this.errorMessage = 'Insufficient funds for this withdrawal.';
      return;
    }

    const newBalance = selectedAccount.balance - formData.amount;

    const transaction = {
      accountId: selectedAccount.id,
      date: new Date().toISOString().split('T')[0],
      description: formData.description || 'Cash Withdrawal',
      type: 'debit',
      amount: formData.amount,
      balance: newBalance
    };

    // Post the new transaction
    this.http.post('http://localhost:3001/transactions', transaction).subscribe({
      next: () => {
        // Update the account balance
        this.http.put(`http://localhost:3001/accounts/${selectedAccount.id}`, {
          ...selectedAccount,
          balance: newBalance
        }).subscribe({
          next: () => {
            this.successMessage = 'Withdrawal successful!';
            this.errorMessage = '';
            this.withdrawalForm.reset();
            this.loadAccounts();
          },
          error: (error) => {
            this.errorMessage = 'Failed to update account balance.';
            console.log(error)
            this.successMessage = '';
          }
        });
        
      },
      error: () => {
        this.errorMessage = 'Failed to process withdrawal transaction.';
        this.successMessage = '';
      }
    });
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.withdrawalForm.get(controlName)?.hasError(errorName) ?? false;
  }
}

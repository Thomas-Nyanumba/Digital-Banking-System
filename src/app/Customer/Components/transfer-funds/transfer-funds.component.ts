import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
    private http: HttpClient
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
    this.http.get<any[]>('http://localhost:3001/accounts')
      .subscribe({
        next: (data) => this.accounts = data,
        error: (err) => console.error('Failed to load accounts:', err)
      });
  }

  onSubmit() {
    if (this.transferForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    const formValues = this.transferForm.value;

    const fromAccount = this.accounts.find(acc => acc.id === parseInt(formValues.fromAccount, 10));
    const toAccount = this.accounts.find(acc => acc.id === parseInt(formValues.toAccount, 10));

    if (!fromAccount || !toAccount) {
      this.errorMessage = 'Invalid account selection.';
      return;
    }

    if (fromAccount.id === toAccount.id) {
      this.errorMessage = 'Cannot transfer to the same account.';
      return;
    }

    if (fromAccount.balance < formValues.amount) {
      this.errorMessage = 'Insufficient funds in the source account.';
      return;
    }

    // Proceed with the transfer
    const amount = parseFloat(formValues.amount);

    const newFromBalance = fromAccount.balance - amount;
    const newToBalance = toAccount.balance + amount;

    const transferPayload = {
      fromAccountId: fromAccount.id,
      toAccountId: toAccount.id,
      amount: amount,
      description: formValues.description || 'Fund Transfer'
    };

    this.http.post('http://localhost:3001/transactions', transferPayload)
      .subscribe({
        next: () => {
          // Update balances for both accounts
          const updatedFromAccount = { ...fromAccount, balance: newFromBalance };
          const updatedToAccount = { ...toAccount, balance: newToBalance };

          const updateFrom = this.http.put(`http://localhost:3001/accounts/${fromAccount.id}`, updatedFromAccount);
          const updateTo = this.http.put(`http://localhost:3001/accounts/${toAccount.id}`, updatedToAccount);

          // Run both updates
          updateFrom.subscribe({
            next: () => {
              updateTo.subscribe({
                next: () => {
                  this.successMessage = 'Funds transferred successfully!';
                  this.errorMessage = '';
                  this.transferForm.reset();
                  this.loadAccounts();
                },
                error: (err) => {
                  console.error('Failed to update destination account:', err);
                  this.errorMessage = 'Failed to update destination account balance.';
                }
              });
            },
            error: (err) => {
              console.error('Failed to update source account:', err);
              this.errorMessage = 'Failed to update source account balance.';
            }
          });
        },
        error: (err) => {
          console.error('Failed to transfer funds:', err);
          this.errorMessage = 'Fund transfer failed.';
        }
      });
  }
}

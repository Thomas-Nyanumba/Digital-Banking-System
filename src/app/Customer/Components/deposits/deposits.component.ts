import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposits.component.html',
  styleUrls: ['./deposits.component.css']
})
export class DepositComponent implements OnInit {
[x: string]: any;

  depositForm: FormGroup;
  message: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.depositForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['Self deposit']
    });
  }

  ngOnInit(): void {}

  onDeposit(): void {
    if (this.depositForm.invalid) {
      this.errorMessage = 'Please fill in a valid deposit amount.';
      return;
    }

    this.isSubmitting = true;
    this.message = '';
    this.errorMessage = '';

    const newTransaction = {
      accountId: 1, // Replace with logged-in user ID
      type: 'deposit',
      amount: this.depositForm.value.amount,
      description: this.depositForm.value.description || 'Self deposit',
      date: new Date().toISOString()
    };

    this.http.post('http://localhost:3001/transactions', newTransaction).subscribe({
      next: () => {
        this.message = 'Deposit was successful!';
        this.depositForm.reset({ description: 'Self deposit' });
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Something went wrong. Try again.';
        this.isSubmitting = false;
      }
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Optional: Define interfaces for strong typing
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface Account {
  id: number;
  customerId: number;
  accountNumber: string;
  accountType: string;
  balance: number;
}

export interface Transaction {
  id: number;
  accountId?: number;
  fromAccountId?: number;
  toAccountId?: number;
  date: string;
  description: string;
  type?: string; // deposit | withdrawal
  amount: number;
  balance?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = 'http://localhost:3001'; // json-server endpoint

  constructor(private http: HttpClient) {}

  // ✅ Get customer details by ID
  getCustomerById(customerId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${customerId}`);
  }

  // ✅ Get accounts linked to a customer
  getAccountsByCustomerId(customerId: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/accounts?customerId=${customerId}`);
  }

  // ✅ Get transactions for a specific account
  getTransactionsByAccountId(accountId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions?accountId=${accountId}`);
  }

  // ✅ Get transfers involving a specific account (as sender or receiver)
  getTransfersByAccountId(accountId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions?fromAccountId=${accountId}&toAccountId=${accountId}`);
  }

  // ✅ Get all transactions involving an account (standard + transfers)
  getAllAccountActivity(accountId: number): Observable<Transaction[]> {
    // You can handle merging the results in a component/service if needed
    const transactions$ = this.getTransactionsByAccountId(accountId);
    const transfers$ = this.getTransfersByAccountId(accountId);
    // Merge logic can be added in the component layer if required
    return transactions$; // Or combineLatest if you want to merge in the service
  }
}

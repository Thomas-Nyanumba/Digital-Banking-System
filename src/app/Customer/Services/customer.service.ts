import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

// Interfaces (Already Present)
export interface User { /* ... */ }
export interface Account { /* ... */ }
export interface Transaction { /* ... */ }

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = 'http://localhost:3001'; // json-server endpoint

  // 🔔 BehaviorSubject to notify components of transaction updates
  private transactionUpdatedSource = new BehaviorSubject<void>(undefined);
  transactionUpdated$ = this.transactionUpdatedSource.asObservable();

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

  // ✅ Get all transactions (can be merged later in the component)
  getAllAccountActivity(accountId: number): Observable<Transaction[]> {
    const transactions$ = this.getTransactionsByAccountId(accountId);
    const transfers$ = this.getTransfersByAccountId(accountId);
    return transactions$;
  }

  // ✅ 🔔 Notify when a transaction is updated
  notifyTransactionUpdate(): void {
    console.log('Transaction update notification sent');
    this.transactionUpdatedSource.next();
  }
}

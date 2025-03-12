import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../Models/account.model';
import { Observable, Subject, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl = 'http://localhost:3001'; // JSON Server base URL

  private accountChangeSubject = new Subject<void>();
  private transactionChangeSubject = new Subject<void>();

  constructor(private http: HttpClient) {}

  /**
   * Fetch accounts by userId
   */
  getAccountsByUserId(userId: number): Observable<Account[]> {
    console.log('Fetching accounts for userId:', userId);
    return this.http.get<Account[]>(`${this.apiUrl}/accounts?UserId=${userId}`);
  }

  /**
   * Fetch all accounts
   */
  getAllAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/accounts`);
  }

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/accounts`);
  }
  
  updateAccount(updatedAccount: Account): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/accounts/${updatedAccount.id}`, updatedAccount);
  }
  

  /**
   * Deposit funds into an account (uses PATCH for partial updates)
   */
  depositToAccount(accountId: number, newBalance: number): Observable<Account> {
    return this.http.patch<Account>(`${this.apiUrl}/accounts/${accountId}`, { balance: newBalance });
  }

  /**
   * Withdraw funds from an account (uses PATCH for partial updates)
   */
  withdrawFromAccount(accountId: number, newBalance: number): Observable<Account> {
    return this.http.patch<Account>(`${this.apiUrl}/accounts/${accountId}`, { balance: newBalance });
  }

  /**
   * Update account balance (generic update - PATCH preferred for partial updates)
   */
  updateAccountBalance(accountId: number, newBalance: number): Observable<Account> {
    return this.http.patch<Account>(`${this.apiUrl}/accounts/${accountId}`, { balance: newBalance });
  }

  /**
   * Create a transaction record (You may adjust the endpoint if you're using `/transactions`)
   */
  createTransaction(transaction: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/transactions`, transaction);
  }

  /**
   * Transfer funds between two accounts and log the transaction
   */
  transferFunds(fromAccount: Account, toAccount: Account, amount: number, description: string = 'Fund Transfer'): Observable<any> {
    const updatedFromBalance = fromAccount.balance - amount;
    const updatedToBalance = toAccount.balance + amount;

    const updateFrom$ = this.updateAccountBalance(fromAccount.id, updatedFromBalance);
    const updateTo$ = this.updateAccountBalance(toAccount.id, updatedToBalance);

    const transferTransaction = {
      fromAccountId: fromAccount.id,
      toAccountId: toAccount.id,
      amount: amount,
      description: description,
      date: new Date().toISOString()
    };

    const createTransaction$ = this.createTransaction(transferTransaction);

    // Execute all updates in parallel
    return forkJoin([updateFrom$, updateTo$, createTransaction$]);
  }

  /**
   * Notify subscribers that an account has changed
   */
  notifyAccountChange(): void {
    this.accountChangeSubject.next();
  }

  /**
   * Notify subscribers that a new transaction has been added
   */
  notifyTransactionChange(): void {
    this.transactionChangeSubject.next();
  }

  /**
   * Observable to listen for account changes
   */
  getAccountChangeObservable(): Observable<void> {
    return this.accountChangeSubject.asObservable();
  }

  /**
   * Observable to listen for transaction changes
   */
  getTransactionChangeObservable(): Observable<void> {
    return this.transactionChangeSubject.asObservable();
  }
}

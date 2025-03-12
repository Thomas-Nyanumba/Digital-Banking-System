export interface Transaction {
    id?: number; // optional if JSON Server generates it
    accountId: number;
    date: string;
    description: string;
    type: 'debit' | 'credit';
    amount: number;
    balance: number;
  }
  
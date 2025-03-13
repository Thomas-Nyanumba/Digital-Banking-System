  // transaction.model.ts
export interface Transaction {
type: any;
  id: number;
  accountId: number;
  date: string;
  description: string;
  amount: number;
  transactionType: string; // 'Credit' or 'Debit'
}

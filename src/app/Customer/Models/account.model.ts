export interface Account {
    id: number;                // Unique identifier for the account
    UserId: number;            // Foreign key linking this account to the user
    accountNumber: string;     // Unique account number
    accountType: string;       // Type of account (e.g., 'Savings', 'Checking')
    balance: number;           // Current balance of the account
    currency: string;          // Currency code (e.g., 'USD', 'KES')
    createdAt: Date;           // Timestamp when the account was created
    updatedAt: Date;           // Timestamp when the account was last updated
    isActive: boolean;         // Status to show if the account is active or not
  }
  
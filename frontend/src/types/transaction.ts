export type TransactionType = "income" | "expense";

export interface Transaction {
    _id: string;
    user: string;
    type: TransactionType;
    amount: number;
    category: string;
    description?: string;
    date: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTransactionData {
    type: TransactionType;
    amount: number;
    category: string;
    description?: string;
    date: string;
}
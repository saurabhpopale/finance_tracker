import axios from "axios";
import api from "./api";

import type {
    Transaction,
    CreateTransactionData
} from "../types/transaction";


// Update transaction data
export interface UpdateTransactionData {
    type: "income" | "expense";
    amount: number;
    category: string;
    description?: string;
    date: string;
}


// Get error message
const getErrorMessage = (
    error: unknown,
    fallback: string
): string => {

    if (axios.isAxiosError(error)) {
        return (
            error.response?.data?.message ||
            fallback
        );
    }

    return fallback;
};


// =====================================================
// GET ALL TRANSACTIONS
// =====================================================

export const getTransactions = async (): Promise<Transaction[]> => {

    try {

        const response =
            await api.get<{
                success: boolean;
                transactions: Transaction[];
            }>(
                "/api/transaction"
            );

        return response.data.transactions;

    } catch (error: unknown) {

        throw new Error(
            getErrorMessage(
                error,
                "Failed to fetch transactions"
            )
        );
    }
};


// =====================================================
// GET SINGLE TRANSACTION
// =====================================================

export const getTransaction = async (
    id: string
): Promise<Transaction> => {

    try {

        const response =
            await api.get<{
                success: boolean;
                transaction: Transaction;
            }>(
                `/api/transaction/${id}`
            );

        return response.data.transaction;

    } catch (error: unknown) {

        throw new Error(
            getErrorMessage(
                error,
                "Failed to fetch transaction"
            )
        );
    }
};


// =====================================================
// CREATE TRANSACTION
// =====================================================

export const createTransaction = async (
    data: CreateTransactionData
): Promise<Transaction> => {

    try {

        const response =
            await api.post<{
                success: boolean;
                transaction: Transaction;
            }>(
                "/api/transaction/create",
                data
            );

        return response.data.transaction;

    } catch (error: unknown) {

        throw new Error(
            getErrorMessage(
                error,
                "Failed to create transaction"
            )
        );
    }
};


// =====================================================
// UPDATE TRANSACTION
// =====================================================

export const updateTransaction = async (
    id: string,
    data: UpdateTransactionData
): Promise<Transaction> => {

    try {

        const response =
            await api.put<{
                success: boolean;
                transaction: Transaction;
            }>(
                `/api/transaction/${id}`,
                data
            );

        return response.data.transaction;

    } catch (error: unknown) {

        throw new Error(
            getErrorMessage(
                error,
                "Failed to update transaction"
            )
        );
    }
};


// =====================================================
// DELETE TRANSACTION
// =====================================================

export const deleteTransaction = async (
    id: string
): Promise<void> => {

    try {

        await api.delete(
            `/api/transaction/${id}`
        );

    } catch (error: unknown) {

        throw new Error(
            getErrorMessage(
                error,
                "Failed to delete transaction"
            )
        );
    }
};
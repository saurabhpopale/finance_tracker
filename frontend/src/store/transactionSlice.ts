import {
    createAsyncThunk,
    createSlice
} from "@reduxjs/toolkit";

import {
    getTransactions,
    getTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction
} from "../services/transactionService";

import type {
    Transaction,
    CreateTransactionData
} from "../types/transaction";

import type {
    UpdateTransactionData
} from "../services/transactionService";


interface TransactionState {

    transactions: Transaction[];

    loading: boolean;

    error: string | null;
}


const initialState: TransactionState = {

    transactions: [],

    loading: false,

    error: null
};


// =====================================================
// FETCH ALL TRANSACTIONS
// =====================================================

export const fetchTransactions =
    createAsyncThunk(
        "transactions/fetch",
        async (
            _,
            { rejectWithValue }
        ) => {

            try {

                const transactions =
                    await getTransactions();

                return transactions;

            } catch (error: unknown) {

                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch transactions";

                return rejectWithValue(message);
            }
        }
    );


// =====================================================
// FETCH SINGLE TRANSACTION
// =====================================================

export const fetchTransaction =
    createAsyncThunk(
        "transactions/fetchOne",
        async (
            id: string,
            { rejectWithValue }
        ) => {

            try {

                const transaction =
                    await getTransaction(id);

                return transaction;

            } catch (error: unknown) {

                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch transaction";

                return rejectWithValue(message);
            }
        }
    );


// =====================================================
// ADD TRANSACTION
// =====================================================

export const addTransaction =
    createAsyncThunk(
        "transactions/add",
        async (
            data: CreateTransactionData,
            { rejectWithValue }
        ) => {

            try {

                const transaction =
                    await createTransaction(data);

                return transaction;

            } catch (error: unknown) {

                console.log(error);

                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to create transaction";

                return rejectWithValue(message);
            }
        }
    );


// =====================================================
// UPDATE TRANSACTION
// =====================================================

export const editTransaction =
    createAsyncThunk(
        "transactions/update",
        async (
            {
                id,
                data
            }: {
                id: string;
                data: UpdateTransactionData;
            },
            { rejectWithValue }
        ) => {

            try {

                const transaction =
                    await updateTransaction(
                        id,
                        data
                    );

                return transaction;

            } catch (error: unknown) {

                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to update transaction";

                return rejectWithValue(message);
            }
        }
    );


// =====================================================
// DELETE TRANSACTION
// =====================================================

export const removeTransaction =
    createAsyncThunk(
        "transactions/delete",
        async (
            id: string,
            { rejectWithValue }
        ) => {

            try {

                await deleteTransaction(id);

                return id;

            } catch (error: unknown) {

                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to delete transaction";

                return rejectWithValue(message);
            }
        }
    );


// =====================================================
// SLICE
// =====================================================

const transactionSlice = createSlice({

    name: "transactions",

    initialState,

    reducers: {},

    extraReducers: (builder) => {


        // =================================================
        // FETCH ALL
        // =================================================

        builder

            .addCase(
                fetchTransactions.pending,
                (state) => {

                    state.loading = true;

                    state.error = null;
                }
            )

            .addCase(
                fetchTransactions.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.transactions =
                        action.payload;
                }
            )

            .addCase(
                fetchTransactions.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload as string;
                }
            );


        // =================================================
        // FETCH SINGLE
        // =================================================

        builder

            .addCase(
                fetchTransaction.pending,
                (state) => {

                    state.loading = true;

                    state.error = null;
                }
            )

            .addCase(
                fetchTransaction.fulfilled,
                (state) => {

                    state.loading = false;
                }
            )

            .addCase(
                fetchTransaction.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload as string;
                }
            );


        // =================================================
        // ADD
        // =================================================

        builder

            .addCase(
                addTransaction.pending,
                (state) => {

                    state.loading = true;

                    state.error = null;
                }
            )

            .addCase(
                addTransaction.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.transactions.unshift(
                        action.payload
                    );
                }
            )

            .addCase(
                addTransaction.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload as string;
                }
            );


        // =================================================
        // UPDATE
        // =================================================

        builder

            .addCase(
                editTransaction.pending,
                (state) => {

                    state.loading = true;

                    state.error = null;
                }
            )

            .addCase(
                editTransaction.fulfilled,
                (state, action) => {

                    state.loading = false;

                    const index =
                        state.transactions.findIndex(
                            (transaction) =>
                                transaction._id ===
                                action.payload._id
                        );

                    if (index !== -1) {

                        state.transactions[index] =
                            action.payload;
                    }
                }
            )

            .addCase(
                editTransaction.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload as string;
                }
            );


        // =================================================
        // DELETE
        // =================================================

        builder

            .addCase(
                removeTransaction.pending,
                (state) => {

                    state.loading = true;

                    state.error = null;
                }
            )

            .addCase(
                removeTransaction.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.transactions =
                        state.transactions.filter(
                            (transaction) =>
                                transaction._id !==
                                action.payload
                        );
                }
            )

            .addCase(
                removeTransaction.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload as string;
                }
            );
    }
});


export default transactionSlice.reducer;
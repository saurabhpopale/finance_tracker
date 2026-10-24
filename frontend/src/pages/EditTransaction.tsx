import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    useAppDispatch,
    useAppSelector
} from "../hooks/redux";

import {
    fetchTransaction,
    editTransaction
} from "../store/transactionSlice";

import type {
    TransactionType
} from "../types/transaction";

const EditTransaction = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const loading = useAppSelector(
        (state) => state.transactions.loading
    );

    const error = useAppSelector(
        (state) => state.transactions.error
    );

    const transactions = useAppSelector(
        (state) => state.transactions.transactions
    );

    const [type, setType] =
        useState<TransactionType>("expense");

    const [amount, setAmount] =
        useState("");

    const [category, setCategory] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [date, setDate] =
        useState("");

    // Load transaction
    useEffect(() => {

        if (!id) return;

        const existingTransaction =
            transactions.find(
                (transaction) =>
                    transaction._id === id
            );

        if (existingTransaction) {

            setType(existingTransaction.type);
            setAmount(
                String(existingTransaction.amount)
            );
            setCategory(
                existingTransaction.category
            );
            setDescription(
                existingTransaction.description || ""
            );
            setDate(
                existingTransaction.date.split("T")[0]
            );

        } else {

            dispatch(fetchTransaction(id))
                .unwrap()
                .then((transaction) => {

                    setType(transaction.type);

                    setAmount(
                        String(transaction.amount)
                    );

                    setCategory(
                        transaction.category
                    );

                    setDescription(
                        transaction.description || ""
                    );

                    setDate(
                        transaction.date.split("T")[0]
                    );
                });
        }

    }, [id, transactions, dispatch]);


    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (!id) return;

        if (!amount || !category || !date) {
            return;
        }

        const result = await dispatch(
            editTransaction({
                id,
                data: {
                    type,
                    amount: Number(amount),
                    category,
                    description,
                    date
                }
            })
        );

        if (
            editTransaction.fulfilled.match(result)
        ) {
            navigate("/transactions");
        }
    };


    const incomeCategories = [
        "Salary",
        "Freelance",
        "Business",
        "Investment",
        "Gift",
        "Other"
    ];

    const expenseCategories = [
        "Food",
        "Shopping",
        "Travel",
        "Bills",
        "Entertainment",
        "Education",
        "Health",
        "Other"
    ];

    const categories =
        type === "income"
            ? incomeCategories
            : expenseCategories;


    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4 py-10">

            <div className="max-w-2xl mx-auto">

                <button
                    type="button"
                    onClick={() =>
                        navigate("/transactions")
                    }
                    className="text-white/80 hover:text-white font-semibold mb-6 cursor-pointer"
                >
                    ← Back to Transactions
                </button>

                <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">

                    <div className="mb-6">

                        <h1 className="text-3xl font-extrabold text-gray-800">
                            Edit Transaction
                        </h1>

                        <p className="text-gray-400 mt-1">
                            Update your transaction details
                        </p>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* Type */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Transaction Type
                            </label>

                            <div className="grid grid-cols-2 gap-4">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setType("income");
                                        setCategory("");
                                    }}
                                    className={`py-4 rounded-xl border-2 font-bold ${
                                        type === "income"
                                            ? "border-green-500 bg-green-50 text-green-600"
                                            : "border-gray-200 text-gray-500"
                                    }`}
                                >
                                    📈 Income
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setType("expense");
                                        setCategory("");
                                    }}
                                    className={`py-4 rounded-xl border-2 font-bold ${
                                        type === "expense"
                                            ? "border-red-500 bg-red-50 text-red-600"
                                            : "border-gray-200 text-gray-500"
                                    }`}
                                >
                                    📉 Expense
                                </button>

                            </div>

                        </div>


                        {/* Amount */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Amount
                            </label>

                            <div className="relative">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(
                                            e.target.value
                                        )
                                    }
                                    required
                                    className="w-full pl-10 pr-4 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none"
                                />

                            </div>

                        </div>


                        {/* Category */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category
                            </label>

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(
                                        e.target.value
                                    )
                                }
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none"
                            >

                                <option value="">
                                    Select category
                                </option>

                                {categories.map(
                                    (item) => (
                                        <option
                                            key={item}
                                            value={item}
                                        >
                                            {item}
                                        </option>
                                    )
                                )}

                            </select>

                        </div>


                        {/* Date */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Date
                            </label>

                            <input
                                type="date"
                                value={date}
                                onChange={(e) =>
                                    setDate(
                                        e.target.value
                                    )
                                }
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none"
                            />

                        </div>


                        {/* Description */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                            </label>

                            <textarea
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                rows={4}
                                placeholder="Enter description"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none resize-none"
                            />

                        </div>


                        {/* Error */}

                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">
                                ⚠️ {error}
                            </div>
                        )}


                        {/* Buttons */}

                        <div className="flex gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/transactions")
                                }
                                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-60 cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
                            >
                                {loading
                                    ? "Updating..."
                                    : "Update Transaction"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default EditTransaction;
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    useAppDispatch,
    useAppSelector
} from "../hooks/redux";

import {
    fetchTransactions,
    removeTransaction
} from "../store/transactionSlice";

const Transactions = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const transactions = useAppSelector(
        (state) => state.transactions.transactions
    );

    const loading = useAppSelector(
        (state) => state.transactions.loading
    );

    useEffect(() => {
        dispatch(fetchTransactions());
    }, [dispatch]);

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!confirmDelete) {
            return;
        }

        await dispatch(removeTransaction(id));
    };

    const sortedTransactions = [...transactions].sort(
        (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4 py-8">

            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                    <div>
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="text-white/80 hover:text-white font-semibold mb-4 transition cursor-pointer"
                        >
                            ← Back to Dashboard
                        </button>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                            All Transactions
                        </h1>

                        <p className="text-white/70 mt-2">
                            View and manage all your income and expenses
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/add-transaction")}
                        className="px-5 py-3 rounded-xl bg-white text-indigo-600 font-bold shadow-lg hover:shadow-xl hover:scale-105 transition"
                    >
                        + Add Transaction
                    </button>

                </div>

                {/* Transaction Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800">
                            Transactions
                        </h2>

                        <p className="text-sm text-gray-400 mt-1">
                            {transactions.length} transaction
                            {transactions.length !== 1 ? "s" : ""}
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>

                                <p className="text-gray-500">
                                    Loading transactions...
                                </p>
                            </div>
                        </div>
                    ) : sortedTransactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">

                            <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center text-4xl mb-5">
                                💳
                            </div>

                            <h3 className="text-xl font-bold text-gray-700">
                                No transactions yet
                            </h3>

                            <p className="text-gray-400 mt-2 max-w-md">
                                Start adding income and expenses to
                                see them here.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/add-transaction")
                                }
                                className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
                            >
                                + Add Transaction
                            </button>

                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">

                            {sortedTransactions.map(
                                (transaction) => (
                                    <div
                                        key={transaction._id}
                                        className="p-5 sm:p-6 hover:bg-gray-50 transition"
                                    >

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                            {/* Left */}
                                            <div className="flex items-center gap-4">

                                                <div
                                                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${transaction.type ===
                                                            "income"
                                                            ? "bg-green-100 text-green-600"
                                                            : "bg-red-100 text-red-500"
                                                        }`}
                                                >
                                                    {transaction.type ===
                                                        "income"
                                                        ? "📈"
                                                        : "📉"}
                                                </div>

                                                <div>
                                                    <h3 className="font-bold text-gray-800">
                                                        {
                                                            transaction.category
                                                        }
                                                    </h3>

                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {transaction.description ||
                                                            "No description"}
                                                    </p>

                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(
                                                            transaction.date
                                                        ).toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric"
                                                            }
                                                        )}
                                                    </p>
                                                </div>

                                            </div>

                                            {/* Right */}
                                            <div className="flex items-center justify-between sm:justify-end gap-5">

                                                <div className="text-right">
                                                    <p
                                                        className={`text-lg font-extrabold ${transaction.type ===
                                                                "income"
                                                                ? "text-green-600"
                                                                : "text-red-500"
                                                            }`}
                                                    >
                                                        {transaction.type ===
                                                            "income"
                                                            ? "+"
                                                            : "-"}
                                                        ₹
                                                        {transaction.amount.toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </p>

                                                    <p
                                                        className={`text-xs font-semibold ${transaction.type ===
                                                                "income"
                                                                ? "text-green-500"
                                                                : "text-red-400"
                                                            }`}
                                                    >
                                                        {transaction.type ===
                                                            "income"
                                                            ? "Income"
                                                            : "Expense"}
                                                    </p>
                                                </div>
                                                {/* Update */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(`/edit-transaction/${transaction._id}`)
                                                    }
                                                    className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition cursor-pointer"
                                                    title="Update transaction"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            transaction._id
                                                        )
                                                    }
                                                    className="w-10 h-10 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition cursor-pointer"
                                                    title="Delete transaction"
                                                >
                                                    🗑️
                                                </button>

                                            </div>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
};

export default Transactions;
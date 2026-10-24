import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    useAppDispatch,
    useAppSelector
} from "../hooks/redux";

import {
    addTransaction
} from "../store/transactionSlice";

import type {
    TransactionType
} from "../types/transaction";


const AddTransaction = () => {

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const loading = useAppSelector(
        (state) => state.transactions.loading
    );

    const error = useAppSelector(
        (state) => state.transactions.error
    );


    const [type, setType] =
        useState<TransactionType>("expense");

    const [amount, setAmount] =
        useState<string>("");

    const [category, setCategory] =
        useState<string>("");

    const [description, setDescription] =
        useState<string>("");

    const [date, setDate] =
        useState<string>(
            new Date().toISOString().split("T")[0]
        );


    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (!amount || !category || !date) {
            return;
        }


        const result = await dispatch(
            addTransaction({
                type,
                amount: Number(amount),
                category,
                description,
                date
            })
        );

            
        if (
            addTransaction.fulfilled.match(result)
        ) {

            navigate("/dashboard");
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4 py-10">

            <div className="max-w-2xl mx-auto">

                {/* Header */}

                <div className="mb-6">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        className="text-white/80 hover:text-white font-semibold mb-5 transition cursor-pointer"
                    >
                        ← Back to Dashboard
                    </button>


                    <div className="flex items-center gap-4">

                        <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                                type === "income"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                            }`}
                        >
                            {type === "income"
                                ? "📈"
                                : "📉"}
                        </div>


                        <div>

                            <h1 className="text-3xl font-extrabold text-white">
                                Add Transaction
                            </h1>

                            <p className="text-white/70 mt-1">
                                Record your income or expense
                            </p>

                        </div>

                    </div>

                </div>


                {/* Form Card */}

                <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* Transaction Type */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Transaction Type
                            </label>


                            <div className="grid grid-cols-2 gap-4">

                                {/* Income */}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setType("income");
                                        setCategory("");
                                    }}
                                    className={`py-4 rounded-xl border-2 font-bold transition ${
                                        type === "income"
                                            ? "border-green-500 bg-green-50 text-green-600 shadow-md"
                                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                                    }`}
                                >
                                    📈 Income
                                </button>


                                {/* Expense */}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setType("expense");
                                        setCategory("");
                                    }}
                                    className={`py-4 rounded-xl border-2 font-bold transition ${
                                        type === "expense"
                                            ? "border-red-500 bg-red-50 text-red-600 shadow-md"
                                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                                    }`}
                                >
                                    📉 Expense
                                </button>

                            </div>

                        </div>


                        {/* Amount */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {type === "income"
                                    ? "Income Amount"
                                    : "Expense Amount"}
                            </label>


                            <div className="relative">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-bold">
                                    ₹
                                </span>


                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder={
                                        type === "income"
                                            ? "Enter income amount"
                                            : "Enter expense amount"
                                    }
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(
                                            e.target.value
                                        )
                                    }
                                    required
                                    className={`w-full pl-10 pr-4 py-4 rounded-xl border border-gray-200 bg-gray-50 text-lg font-semibold outline-none focus:bg-white focus:ring-4 ${
                                        type === "income"
                                            ? "focus:border-green-500 focus:ring-green-100"
                                            : "focus:border-red-500 focus:ring-red-100"
                                    }`}
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
                                className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:ring-4 ${
                                    type === "income"
                                        ? "focus:border-green-500 focus:ring-green-100"
                                        : "focus:border-red-500 focus:ring-red-100"
                                }`}
                            >

                                <option value="">
                                    Select category
                                </option>


                                {type === "income" ? (
                                    <>
                                        <option value="Salary">
                                            💼 Salary
                                        </option>

                                        <option value="Freelance">
                                            💻 Freelance
                                        </option>

                                        <option value="Business">
                                            🏢 Business
                                        </option>

                                        <option value="Investment">
                                            📊 Investment
                                        </option>

                                        <option value="Gift">
                                            🎁 Gift
                                        </option>

                                        <option value="Other">
                                            📦 Other
                                        </option>
                                    </>
                                ) : (
                                    <>
                                        <option value="Food">
                                            🍔 Food
                                        </option>

                                        <option value="Shopping">
                                            🛍️ Shopping
                                        </option>

                                        <option value="Travel">
                                            ✈️ Travel
                                        </option>

                                        <option value="Bills">
                                            🧾 Bills
                                        </option>

                                        <option value="Entertainment">
                                            🎬 Entertainment
                                        </option>

                                        <option value="Education">
                                            📚 Education
                                        </option>

                                        <option value="Health">
                                            🏥 Health
                                        </option>

                                        <option value="Other">
                                            📦 Other
                                        </option>
                                    </>
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
                                className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:ring-4 ${
                                    type === "income"
                                        ? "focus:border-green-500 focus:ring-green-100"
                                        : "focus:border-red-500 focus:ring-red-100"
                                }`}
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
                                placeholder={
                                    type === "income"
                                        ? "Where did this income come from?"
                                        : "What did you spend this money on?"
                                }
                                rows={4}
                                className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none resize-none focus:bg-white focus:ring-4 ${
                                    type === "income"
                                        ? "focus:border-green-500 focus:ring-green-100"
                                        : "focus:border-red-500 focus:ring-red-100"
                                }`}
                            />

                        </div>


                        {/* Error */}

                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                                ⚠️ {error}
                            </div>
                        )}


                        {/* Buttons */}

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/dashboard")
                                }
                                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition cursor-pointer"
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 py-3 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
                                    type === "income"
                                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                        : "bg-gradient-to-r from-red-500 to-pink-500"
                                }`}
                            >
                                {loading
                                    ? "Saving..."
                                    : `Save ${
                                          type === "income"
                                              ? "Income"
                                              : "Expense"
                                      }`}
                            </button>

                        </div>

                    </form>

                </div>


                {/* Information */}

                <div className="mt-5 bg-white/10 border border-white/20 rounded-2xl p-4 text-white/80 text-sm">

                    💡 Your transaction will be saved securely to your
                    account and your dashboard balance, income, expenses,
                    and savings will update automatically.

                </div>

            </div>

        </div>
    );
};


export default AddTransaction;
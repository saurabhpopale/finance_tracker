import { useState } from "react";

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


interface AddTransactionProps {
    onClose: () => void;
}


const AddTransaction = ({
    onClose
}: AddTransactionProps) => {

    const dispatch = useAppDispatch();

    const loading = useAppSelector(
        (state) => state.transactions.loading
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

            setAmount("");
            setCategory("");
            setDescription("");

            onClose();
        }
    };


    return (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

            <div
                className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-8"
            >

                {/* Header */}

                <div className="flex items-center justify-between mb-6">

                    <div>

                        <h2 className="text-2xl font-bold text-gray-800">
                            Add Transaction
                        </h2>

                        <p className="text-sm text-gray-400 mt-1">
                            Record your income or expense
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 text-xl hover:bg-gray-200 transition"
                    >
                        ×
                    </button>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Type */}

                    <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Transaction Type
                        </label>


                        <div className="grid grid-cols-2 gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setType("income")
                                }
                                className={`py-3 rounded-xl font-semibold border-2 transition ${type === "income"
                                        ? "border-green-500 bg-green-50 text-green-600"
                                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                📈 Income
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    setType("expense")
                                }
                                className={`py-3 rounded-xl font-semibold border-2 transition ${type === "expense"
                                        ? "border-red-500 bg-red-50 text-red-600"
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
                            Amount
                        </label>

                        <div className="relative">

                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                                ₹
                            </span>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(e.target.value)
                                }
                                required
                                className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
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
                                setCategory(e.target.value)
                            }
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                        >

                            <option value="">
                                Select category
                            </option>

                            {type === "expense" ? (
                                <>
                                    <option value="Food">
                                        Food
                                    </option>

                                    <option value="Shopping">
                                        Shopping
                                    </option>

                                    <option value="Travel">
                                        Travel
                                    </option>

                                    <option value="Bills">
                                        Bills
                                    </option>

                                    <option value="Entertainment">
                                        Entertainment
                                    </option>

                                    <option value="Education">
                                        Education
                                    </option>

                                    <option value="Health">
                                        Health
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>
                                </>
                            ) : (
                                <>
                                    <option value="Salary">
                                        Salary
                                    </option>

                                    <option value="Freelance">
                                        Freelance
                                    </option>

                                    <option value="Business">
                                        Business
                                    </option>

                                    <option value="Investment">
                                        Investment
                                    </option>

                                    <option value="Gift">
                                        Gift
                                    </option>

                                    <option value="Other">
                                        Other
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
                                setDate(e.target.value)
                            }
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                        />

                    </div>


                    {/* Description */}

                    <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>

                        <textarea
                            placeholder="Optional description..."
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none resize-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                        />

                    </div>


                    {/* Buttons */}

                    <div className="flex gap-3 pt-2">

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? "Saving..."
                                : "Save Transaction"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default AddTransaction;
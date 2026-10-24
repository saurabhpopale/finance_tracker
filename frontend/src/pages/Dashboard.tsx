import { useEffect } from "react";

import {
    useAppSelector,
    useAppDispatch
} from "../hooks/redux";

import {
    logout
} from "../store/authSlice";

import {
    fetchTransactions
} from "../store/transactionSlice";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {

    const dispatch = useAppDispatch();
    let navigate = useNavigate();
    const user =
        useAppSelector(
            (state) => state.auth.user
        );
    const transactions =
        useAppSelector(
            (state) =>
                state.transactions.transactions
        );

    useEffect(() => {

        dispatch(fetchTransactions());

    }, [dispatch]);


    const handleLogout = async () => {

        await dispatch(logout());

    };

    const totalIncome =
        transactions
            .filter(
                (transaction) =>
                    transaction.type === "income"
            )
            .reduce(
                (total, transaction) =>
                    total + transaction.amount,
                0
            );


    const totalExpenses =
        transactions
            .filter(
                (transaction) =>
                    transaction.type === "expense"
            )
            .reduce(
                (total, transaction) =>
                    total + transaction.amount,
                0
            );


    const saving = totalIncome - totalExpenses;
    const latestTransactions = [...transactions]
        .sort(
            (a, b) =>
                new Date(b.date).getTime() -
                new Date(a.date).getTime()
        )
        .slice(0, 3);

    useEffect(() => {
        dispatch(fetchTransactions());
    }, [dispatch]);

    return (
        <div className="relative z-0 min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

            {/* Background decorations */}
            <div className="fixed top-20 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="fixed bottom-10 right-10 w-52 h-52 bg-pink-300/20 rounded-full blur-3xl pointer-events-none"></div>


            {/* Navbar */}
            <nav className="relative bg-white/95 backdrop-blur-xl shadow-lg">

                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    {/* Logo */}
                    <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center shadow-md">
                            <span className="text-xl">
                                💰
                            </span>
                        </div>

                        <div>
                            <h1 className="text-xl font-extrabold text-gray-800">
                                Finance Manager
                            </h1>

                            <p className="text-xs text-gray-400">
                                Smart money management
                            </p>
                        </div>

                    </div>


                    {/* User + Logout */}
                    <div className="flex items-center gap-4">

                        {user && (
                            <div className="hidden sm:block text-right">

                                <p className="text-sm font-semibold text-gray-800">
                                    {user.firstName} {user.lastName}
                                </p>

                                <p className="text-xs text-gray-400">
                                    {user.email}
                                </p>

                            </div>
                        )}

                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-xl bg-red-50 text-red-500 font-semibold border border-red-100 transition-all duration-300 hover:bg-red-500 hover:text-white hover:shadow-md hover:cursor-pointer"
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </nav>


            {/* Main Content */}
            <main className="relative max-w-7xl mx-auto px-6 py-10">

                {/* Welcome Section */}
                <div className="mb-8">

                    <p className="text-white/70 text-sm font-medium">
                        Welcome back 👋
                    </p>

                    {user && (
                        <h2 className="text-4xl font-extrabold text-white mt-1">
                            Hello, {user.firstName}!
                        </h2>
                    )}

                    <p className="text-white/70 mt-2">
                        Here's an overview of your financial activity.
                    </p>

                </div>


                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

                    


                    {/* Income */}
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:scale-[1.02] transition-transform">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Total Income
                                </p>

                                <h3 className="text-2xl font-extrabold text-green-600 mt-2">
                                    ₹{totalIncome.toLocaleString("en-IN")}
                                </h3>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
                                📈
                            </div>

                        </div>

                    </div>


                    {/* Expenses */}
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:scale-[1.02] transition-transform">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Total Expenses
                                </p>

                                <h3 className="text-2xl font-extrabold text-red-500 mt-2">
                                    ₹{totalExpenses.toLocaleString("en-IN")}
                                </h3>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-2xl">
                                📉
                            </div>

                        </div>

                    </div>


                    {/* Savings */}
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:scale-[1.02] transition-transform">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Savings
                                </p>

                                <h3 className="text-2xl font-extrabold text-purple-600 mt-2">
                                    ₹{saving.toLocaleString("en-IN")}
                                </h3>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
                                🏦
                            </div>

                        </div>

                    </div>

                </div>


                {/* Main Dashboard Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


                    {/* Recent Transactions */}
                    <div className="lg:col-span-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-6">

                        <div className="flex items-center justify-between mb-6">

                            <div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    Recent Transactions
                                </h3>

                                <p className="text-sm text-gray-400 mt-1">
                                    Your latest financial activity
                                </p>
                            </div>

                            <button onClick={() => navigate("/transactions")} className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-semibold hover:bg-indigo-100 transition cursor-pointer">
                                View All
                            </button>

                        </div>


                        {/* Empty state */}
                        {latestTransactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center text-4xl mb-4">
                                    💳
                                </div>

                                <h4 className="text-lg font-bold text-gray-700">
                                    No transactions yet
                                </h4>

                                <p className="text-sm text-gray-400 mt-2 max-w-sm">
                                    Start adding your income and expenses to keep
                                    track of your finances.
                                </p>

                                <button
                                    onClick={() => navigate("/add-transaction")}
                                    className="mt-5 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                                >
                                    + Add Transaction
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {latestTransactions.map((transaction) => (
                                    <div
                                        key={transaction._id}
                                        className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                                    >
                                        <div className="flex items-center gap-4">

                                            <div
                                                className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${transaction.type === "income"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-red-100 text-red-500"
                                                    }`}
                                            >
                                                {transaction.type === "income"
                                                    ? "📈"
                                                    : "📉"}
                                            </div>

                                            <div>
                                                <p className="font-bold text-gray-800">
                                                    {transaction.category}
                                                </p>

                                                <p className="text-xs text-gray-400 mt-1">
                                                    {transaction.description ||
                                                        "No description"}
                                                </p>

                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(
                                                        transaction.date
                                                    ).toLocaleDateString("en-IN")}
                                                </p>
                                            </div>

                                        </div>

                                        <p
                                            className={`font-bold text-lg ${transaction.type === "income"
                                                ? "text-green-600"
                                                : "text-red-500"
                                                }`}
                                        >
                                            {transaction.type === "income"
                                                ? "+"
                                                : "-"}
                                            ₹
                                            {transaction.amount.toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>


                    {/* Quick Actions */}
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-6">

                        <h3 className="text-xl font-bold text-gray-800">
                            Quick Actions
                        </h3>

                        <p className="text-sm text-gray-400 mt-1 mb-6">
                            Manage your finances quickly
                        </p>


                        <div className="space-y-4">

                            {/* Add Income */}
                            <button onClick={() => navigate('/add-transaction')} className="w-full flex items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 transition-all text-left hover:cursor-pointer">

                                <div className="w-11 h-11 rounded-lg bg-green-500 text-white flex items-center justify-center text-xl">
                                    +
                                </div>

                                <div>
                                    <p className="font-bold text-gray-800">
                                        Add Income
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        Record money received
                                    </p>
                                </div>

                            </button>


                            {/* Add Expense */}
                            <button onClick={() => navigate('/add-transaction')} className="w-full flex items-center gap-4 p-4 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100 transition-all text-left hover:cursor-pointer">

                                <div className="w-11 h-11 rounded-lg bg-red-500 text-white flex items-center justify-center text-xl">
                                    −
                                </div>

                                <div>
                                    <p className="font-bold text-gray-800">
                                        Add Expense
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        Record money spent
                                    </p>
                                </div>

                            </button>


                            {/* View Reports */}
                            <button
                            onClick={()=>navigate('/reports')}
                             className="w-full flex items-center gap-4 p-4 rounded-xl bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-all text-left cursor-pointer">

                                <div className="w-11 h-11 rounded-lg bg-purple-500 text-white flex items-center justify-center text-xl">
                                    📊
                                </div>

                                <div>
                                    <p className="font-bold text-gray-800">
                                        View Reports
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        Analyze your spending
                                    </p>
                                </div>

                            </button>

                        </div>

                    </div>

                </div>


                {/* Account Information */}
                {user && (
                    <div className="mt-6 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-6">

                        <h3 className="text-xl font-bold text-gray-800 mb-5">
                            Account Information
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-400">
                                    First Name
                                </p>

                                <p className="font-semibold text-gray-800 mt-1">
                                    {user.firstName}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-400">
                                    Last Name
                                </p>

                                <p className="font-semibold text-gray-800 mt-1">
                                    {user.lastName}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-400">
                                    Email
                                </p>

                                <p className="font-semibold text-gray-800 mt-1 break-all">
                                    {user.email}
                                </p>
                            </div>

                        </div>

                    </div>
                )}

            </main>

        </div>

    );
};

export default Dashboard;
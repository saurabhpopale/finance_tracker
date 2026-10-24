import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from "recharts";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchTransactions } from "../store/transactionSlice";

type ReportType =
    | "overall"
    | "month"
    | "category"
    | "graphs";

const Reports = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const transactions = useAppSelector(
        (state) => state.transactions.transactions
    );

    const [reportType, setReportType] =
        useState<ReportType>("overall");

    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();

        return `${now.getFullYear()}-${String(
            now.getMonth() + 1
        ).padStart(2, "0")}`;
    });

    useEffect(() => {
        dispatch(fetchTransactions());
    }, [dispatch]);

    // --------------------------------------------------
    // Overall calculations
    // --------------------------------------------------

    const totalIncome = useMemo(() => {
        return transactions
            .filter(
                (transaction) =>
                    transaction.type === "income"
            )
            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount),
                0
            );
    }, [transactions]);

    const totalExpense = useMemo(() => {
        return transactions
            .filter(
                (transaction) =>
                    transaction.type === "expense"
            )
            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount),
                0
            );
    }, [transactions]);

    const savings = totalIncome - totalExpense;

    // --------------------------------------------------
    // Available months
    // --------------------------------------------------

    const availableMonths = useMemo(() => {
        const months = transactions.map((transaction) => {
            const date = new Date(transaction.date);

            return `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;
        });

        return [...new Set(months)].sort().reverse();
    }, [transactions]);

    // --------------------------------------------------
    // Selected month transactions
    // --------------------------------------------------

    const selectedMonthTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            const date = new Date(transaction.date);

            const month = `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;

            return month === selectedMonth;
        });
    }, [transactions, selectedMonth]);

    // --------------------------------------------------
    // Month-wise report
    // --------------------------------------------------

    const monthWiseReport = useMemo(() => {
        const report: Record<
            string,
            {
                income: number;
                expense: number;
            }
        > = {};

        transactions.forEach((transaction) => {
            const date = new Date(transaction.date);

            const month = `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;

            if (!report[month]) {
                report[month] = {
                    income: 0,
                    expense: 0
                };
            }

            if (transaction.type === "income") {
                report[month].income += Number(
                    transaction.amount
                );
            } else {
                report[month].expense += Number(
                    transaction.amount
                );
            }
        });

        return Object.entries(report)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, values]) => ({
                month,
                monthLabel: formatMonth(month),
                income: values.income,
                expense: values.expense,
                savings:
                    values.income - values.expense
            }));
    }, [transactions]);

    // --------------------------------------------------
    // Category-wise report
    // --------------------------------------------------

    const categoryWiseReport = useMemo(() => {
        const report: Record<string, number> = {};

        selectedMonthTransactions
            .filter(
                (transaction) =>
                    transaction.type === "expense"
            )
            .forEach((transaction) => {
                if (!report[transaction.category]) {
                    report[transaction.category] = 0;
                }

                report[transaction.category] += Number(
                    transaction.amount
                );
            });

        return Object.entries(report)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount]) => ({
                category,
                amount
            }));
    }, [selectedMonthTransactions]);

    // --------------------------------------------------
    // Selected month calculations
    // --------------------------------------------------

    const selectedMonthIncome =
        selectedMonthTransactions
            .filter(
                (transaction) =>
                    transaction.type === "income"
            )
            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount),
                0
            );

    const selectedMonthExpense =
        selectedMonthTransactions
            .filter(
                (transaction) =>
                    transaction.type === "expense"
            )
            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount),
                0
            );

    const selectedMonthSavings =
        selectedMonthIncome - selectedMonthExpense;

    // --------------------------------------------------
    // Graph data
    // --------------------------------------------------

    // Bar chart data
    const barChartData = monthWiseReport.map((item) => ({
        month: item.monthLabel,
        income: item.income,
        expense: item.expense
    }));

    // Pie chart data
    const pieChartData = categoryWiseReport.map((item) => ({
        name: item.category,
        value: item.amount
    }));

    // Line chart data
    const lineChartData = monthWiseReport.map((item) => ({
        month: item.monthLabel,
        income: item.income,
        expense: item.expense
    }));

    // --------------------------------------------------
    // Helpers
    // --------------------------------------------------

    function formatCurrency(amount: number) {
        return `₹${amount.toLocaleString("en-IN")}`;
    }

    function formatMonth(month: string) {
        const [year, monthNumber] = month.split("-");

        return new Date(
            Number(year),
            Number(monthNumber) - 1
        ).toLocaleDateString("en-IN", {
            month: "short",
            year: "numeric"
        });
    }

    const pieColors = [
        "#f97316",
        "#3b82f6",
        "#22c55e",
        "#ef4444",
        "#a855f7",
        "#eab308",
        "#14b8a6",
        "#ec4899"
    ];

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <header className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Reports
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Analyze your income and expenses
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                    >
                        ← Dashboard
                    </button>

                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* Report options */}
                <div className="bg-white rounded-xl shadow-sm border p-2 flex flex-wrap gap-2 mb-8">

                    <button
                        type="button"
                        onClick={() =>
                            setReportType("overall")
                        }
                        className={`px-5 py-2.5 rounded-lg font-medium transition cursor-pointer ${reportType === "overall"
                            ? "bg-orange-500 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        Overall
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setReportType("month")
                        }
                        className={`px-5 py-2.5 rounded-lg font-medium transition cursor-pointer ${reportType === "month"
                            ? "bg-orange-500 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        Month Wise
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setReportType("category")
                        }
                        className={`px-5 py-2.5 rounded-lg font-medium transition cursor-pointer ${reportType === "category"
                            ? "bg-orange-500 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        Category Wise
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setReportType("graphs")
                        }
                        className={`px-5 py-2.5 rounded-lg font-medium transition cursor-pointer ${reportType === "graphs"
                            ? "bg-orange-500 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        📊 View Graphs
                    </button>

                </div>

                {/* ==================================================
                    OVERALL
                ================================================== */}

                {reportType === "overall" && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

                            <div className="bg-white rounded-xl border shadow-sm p-6">
                                <p className="text-gray-500 text-sm">
                                    Total Income
                                </p>

                                <h2 className="text-2xl font-bold text-green-600 mt-2">
                                    {formatCurrency(
                                        totalIncome
                                    )}
                                </h2>
                            </div>

                            <div className="bg-white rounded-xl border shadow-sm p-6">
                                <p className="text-gray-500 text-sm">
                                    Total Expenses
                                </p>

                                <h2 className="text-2xl font-bold text-red-500 mt-2">
                                    {formatCurrency(
                                        totalExpense
                                    )}
                                </h2>
                            </div>

                            <div className="bg-white rounded-xl border shadow-sm p-6">
                                <p className="text-gray-500 text-sm">
                                    Savings
                                </p>

                                <h2 className="text-2xl font-bold text-blue-600 mt-2">
                                    {formatCurrency(
                                        savings
                                    )}
                                </h2>
                            </div>

                        </div>

                        <div className="bg-white rounded-xl border shadow-sm p-6">

                            <h2 className="text-lg font-bold text-gray-800 mb-6">
                                Income vs Expense
                            </h2>

                            <div className="space-y-5">

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">
                                            Income
                                        </span>

                                        <span className="text-sm font-semibold text-green-600">
                                            {formatCurrency(
                                                totalIncome
                                            )}
                                        </span>
                                    </div>

                                    <div className="w-full bg-gray-100 rounded-full h-3">
                                        <div
                                            className="bg-green-500 h-3 rounded-full"
                                            style={{
                                                width: `${totalIncome +
                                                    totalExpense ===
                                                    0
                                                    ? 0
                                                    : (totalIncome /
                                                        (totalIncome +
                                                            totalExpense)) *
                                                    100
                                                    }%`
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">
                                            Expenses
                                        </span>

                                        <span className="text-sm font-semibold text-red-500">
                                            {formatCurrency(
                                                totalExpense
                                            )}
                                        </span>
                                    </div>

                                    <div className="w-full bg-gray-100 rounded-full h-3">
                                        <div
                                            className="bg-red-500 h-3 rounded-full"
                                            style={{
                                                width: `${totalIncome +
                                                    totalExpense ===
                                                    0
                                                    ? 0
                                                    : (totalExpense /
                                                        (totalIncome +
                                                            totalExpense)) *
                                                    100
                                                    }%`
                                            }}
                                        />
                                    </div>
                                </div>

                            </div>

                        </div>
                    </>
                )}

                {/* ==================================================
                    MONTH WISE
                ================================================== */}

                {reportType === "month" && (
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

                        <div className="p-6 border-b">
                            <h2 className="text-lg font-bold text-gray-800">
                                Month-wise Report
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Income, expenses and savings
                                for each month
                            </p>
                        </div>

                        {monthWiseReport.length === 0 ? (
                            <div className="p-10 text-center text-gray-500">
                                No transaction data available.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                                Month
                                            </th>

                                            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                                                Income
                                            </th>

                                            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                                                Expense
                                            </th>

                                            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                                                Savings
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {monthWiseReport
                                            .slice()
                                            .reverse()
                                            .map(
                                                (
                                                    item
                                                ) => (
                                                    <tr
                                                        key={
                                                            item.month
                                                        }
                                                        className="border-t hover:bg-gray-50"
                                                    >
                                                        <td className="px-6 py-4 font-medium text-gray-800">
                                                            {
                                                                item.monthLabel
                                                            }
                                                        </td>

                                                        <td className="px-6 py-4 text-right text-green-600 font-medium">
                                                            {formatCurrency(
                                                                item.income
                                                            )}
                                                        </td>

                                                        <td className="px-6 py-4 text-right text-red-500 font-medium">
                                                            {formatCurrency(
                                                                item.expense
                                                            )}
                                                        </td>

                                                        <td
                                                            className={`px-6 py-4 text-right font-semibold ${item.savings >=
                                                                0
                                                                ? "text-blue-600"
                                                                : "text-red-600"
                                                                }`}
                                                        >
                                                            {formatCurrency(
                                                                item.savings
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                    </tbody>

                                </table>

                            </div>
                        )}

                    </div>
                )}

                {/* ==================================================
                    CATEGORY WISE
                ================================================== */}

                {reportType === "category" && (
                    <>
                        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">
                                        Category-wise Report
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        See where your money
                                        is being spent
                                    </p>
                                </div>

                                <select
                                    value={selectedMonth}
                                    onChange={(e) =>
                                        setSelectedMonth(
                                            e.target.value
                                        )
                                    }
                                    className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
                                >
                                    {availableMonths.length ===
                                        0 ? (
                                        <option value={selectedMonth}>
                                            No months available
                                        </option>
                                    ) : (
                                        availableMonths.map(
                                            (month) => (
                                                <option
                                                    key={
                                                        month
                                                    }
                                                    value={
                                                        month
                                                    }
                                                >
                                                    {formatMonth(
                                                        month
                                                    )}
                                                </option>
                                            )
                                        )
                                    )}
                                </select>

                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

                            <div className="bg-white rounded-xl border shadow-sm p-6">
                                <p className="text-sm text-gray-500">
                                    Monthly Income
                                </p>

                                <p className="text-xl font-bold text-green-600 mt-2">
                                    {formatCurrency(
                                        selectedMonthIncome
                                    )}
                                </p>
                            </div>

                            <div className="bg-white rounded-xl border shadow-sm p-6">
                                <p className="text-sm text-gray-500">
                                    Monthly Expenses
                                </p>

                                <p className="text-xl font-bold text-red-500 mt-2">
                                    {formatCurrency(
                                        selectedMonthExpense
                                    )}
                                </p>
                            </div>

                            <div className="bg-white rounded-xl border shadow-sm p-6">
                                <p className="text-sm text-gray-500">
                                    Monthly Savings
                                </p>

                                <p className="text-xl font-bold text-blue-600 mt-2">
                                    {formatCurrency(
                                        selectedMonthSavings
                                    )}
                                </p>
                            </div>

                        </div>

                        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

                            <div className="p-6 border-b">
                                <h3 className="font-bold text-gray-800">
                                    Expenses by Category
                                </h3>
                            </div>

                            {categoryWiseReport.length ===
                                0 ? (
                                <div className="p-10 text-center text-gray-500">
                                    No expenses found for
                                    this month.
                                </div>
                            ) : (
                                <div className="divide-y">

                                    {categoryWiseReport.map(
                                        (item) => {

                                            const percentage =
                                                selectedMonthExpense ===
                                                    0
                                                    ? 0
                                                    : (item.amount /
                                                        selectedMonthExpense) *
                                                    100;

                                            return (
                                                <div
                                                    key={
                                                        item.category
                                                    }
                                                    className="p-5"
                                                >
                                                    <div className="flex justify-between items-center mb-2">

                                                        <span className="font-medium text-gray-700">
                                                            {
                                                                item.category
                                                            }
                                                        </span>

                                                        <span className="font-semibold text-gray-800">
                                                            {formatCurrency(
                                                                item.amount
                                                            )}
                                                        </span>

                                                    </div>

                                                    <div className="w-full bg-gray-100 rounded-full h-2.5">

                                                        <div
                                                            className="bg-orange-500 h-2.5 rounded-full"
                                                            style={{
                                                                width: `${percentage}%`
                                                            }}
                                                        />

                                                    </div>

                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {percentage.toFixed(
                                                            1
                                                        )}
                                                        % of
                                                        total
                                                        expenses
                                                    </p>

                                                </div>
                                            );
                                        }
                                    )}

                                </div>
                            )}

                        </div>
                    </>
                )}

                {/* ==================================================
                    GRAPHS
                ================================================== */}

                {/* ==================================================
    GRAPHS
================================================== */}

                {reportType === "graphs" && (
                    <div className="space-y-4">

                        {/* Graph Header */}
                        <div className="bg-white rounded-xl border shadow-sm p-4">

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">
                                        Financial Graphs
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Visualize your income, expenses and
                                        spending patterns
                                    </p>
                                </div>

                                <select
                                    value={selectedMonth}
                                    onChange={(e) =>
                                        setSelectedMonth(e.target.value)
                                    }
                                    className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
                                >
                                    {availableMonths.length === 0 ? (
                                        <option value={selectedMonth}>
                                            No months available
                                        </option>
                                    ) : (
                                        availableMonths.map((month) => (
                                            <option
                                                key={month}
                                                value={month}
                                            >
                                                {formatMonth(month)}
                                            </option>
                                        ))
                                    )}
                                </select>

                            </div>

                        </div>


                        {/* ==================================================
            BAR + PIE CHART
        ================================================== */}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                            {/* ---------------- BAR CHART ---------------- */}

                            <div className="bg-white rounded-xl border shadow-sm p-4">

                                <div className="mb-3">
                                    <h3 className="text-base font-bold text-gray-800">
                                        Month-wise Income vs Expense
                                    </h3>

                                    <p className="text-xs text-gray-500 mt-1">
                                        Compare income and expenses across months
                                    </p>
                                </div>

                                {barChartData.length === 0 ? (

                                    <div className="h-56 flex items-center justify-center text-gray-500 text-sm">
                                        No transaction data available.
                                    </div>

                                ) : (

                                    <div className="w-full h-56">

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <BarChart
                                                data={barChartData}
                                                margin={{
                                                    top: 5,
                                                    right: 5,
                                                    left: -15,
                                                    bottom: 5
                                                }}
                                            >

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                />

                                                <XAxis
                                                    dataKey="month"
                                                    tick={{ fontSize: 11 }}
                                                />

                                                <YAxis
                                                    tick={{ fontSize: 11 }}
                                                />

                                                <Tooltip
                                                    formatter={(value) =>
                                                        formatCurrency(
                                                            Number(value)
                                                        )
                                                    }
                                                />

                                                <Legend
                                                    wrapperStyle={{
                                                        fontSize: "12px"
                                                    }}
                                                />

                                                <Bar
                                                    dataKey="income"
                                                    name="Income"
                                                    fill="#22c55e"
                                                    radius={[
                                                        4,
                                                        4,
                                                        0,
                                                        0
                                                    ]}
                                                />

                                                <Bar
                                                    dataKey="expense"
                                                    name="Expense"
                                                    fill="#ef4444"
                                                    radius={[
                                                        4,
                                                        4,
                                                        0,
                                                        0
                                                    ]}
                                                />

                                            </BarChart>

                                        </ResponsiveContainer>

                                    </div>

                                )}

                            </div>


                            {/* ---------------- PIE CHART ---------------- */}

                            <div className="bg-white rounded-xl border shadow-sm p-4">

                                <div className="mb-3">

                                    <h3 className="text-base font-bold text-gray-800">
                                        Category-wise Expenses
                                    </h3>

                                    <p className="text-xs text-gray-500 mt-1">
                                        Expenses for {formatMonth(selectedMonth)}
                                    </p>

                                </div>

                                {pieChartData.length === 0 ? (

                                    <div className="h-56 flex items-center justify-center text-gray-500 text-sm">
                                        No expense data available.
                                    </div>

                                ) : (

                                    <div className="w-full h-56">

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <PieChart>

                                                <Pie
                                                    data={pieChartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    label={({
                                                        name,
                                                        percent
                                                    }) =>
                                                        `${name} ${(
                                                            ((percent as number) || 0) * 100
                                                        ).toFixed(0)}%`
                                                    }
                                                    labelLine={false}
                                                >

                                                    {pieChartData.map(
                                                        (_, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    pieColors[
                                                                    index %
                                                                    pieColors.length
                                                                    ]
                                                                }
                                                            />
                                                        )
                                                    )}

                                                </Pie>

                                                <Tooltip
                                                    formatter={(value) =>
                                                        formatCurrency(
                                                            Number(value)
                                                        )
                                                    }
                                                />

                                                <Legend
                                                    wrapperStyle={{
                                                        fontSize: "11px"
                                                    }}
                                                />

                                            </PieChart>

                                        </ResponsiveContainer>

                                    </div>

                                )}

                            </div>

                        </div>


                        {/* ==================================================
            LINE CHART
        ================================================== */}

                        <div className="bg-white rounded-xl border shadow-sm p-4">

                            <div className="mb-3">

                                <h3 className="text-base font-bold text-gray-800">
                                    Monthly Financial Trend
                                </h3>

                                <p className="text-xs text-gray-500 mt-1">
                                    Track income and expenses over time
                                </p>

                            </div>

                            {lineChartData.length === 0 ? (

                                <div className="h-56 flex items-center justify-center text-gray-500 text-sm">
                                    No transaction data available.
                                </div>

                            ) : (

                                <div className="w-full h-56">

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <LineChart
                                            data={lineChartData}
                                            margin={{
                                                top: 5,
                                                right: 10,
                                                left: -15,
                                                bottom: 5
                                            }}
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                            />

                                            <XAxis
                                                dataKey="month"
                                                tick={{ fontSize: 11 }}
                                            />

                                            <YAxis
                                                tick={{ fontSize: 11 }}
                                            />

                                            <Tooltip
                                                formatter={(value) =>
                                                    formatCurrency(
                                                        Number(value)
                                                    )
                                                }
                                            />

                                            <Legend
                                                wrapperStyle={{
                                                    fontSize: "12px"
                                                }}
                                            />

                                            <Line
                                                type="monotone"
                                                dataKey="income"
                                                name="Income"
                                                stroke="#22c55e"
                                                strokeWidth={2.5}
                                                dot={{ r: 4 }}
                                            />

                                            <Line
                                                type="monotone"
                                                dataKey="expense"
                                                name="Expense"
                                                stroke="#ef4444"
                                                strokeWidth={2.5}
                                                dot={{ r: 4 }}
                                            />

                                        </LineChart>

                                    </ResponsiveContainer>

                                </div>

                            )}

                        </div>

                    </div>
                )}

            </main>
        </div>
    );
};

export default Reports;
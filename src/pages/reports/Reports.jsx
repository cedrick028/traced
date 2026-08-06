import { useMemo, useState } from "react";
import { addMonths, eachDayOfInterval, endOfMonth, format, isSameMonth, startOfMonth } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import useTransaction from "../../hooks/useTransaction";
import { formatCurrency } from "../../utils/formatCurrency";
import { isIncomeTransaction } from "../../utils/transactionType";

const CHART_COLORS = [
  "#0F172A",
  "#2563EB",
  "#0EA5E9",
  "#14B8A6",
  "#10B981",
  "#F59E0B",
  "#F97316",
  "#EF4444"
];

const toDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

const formatCategoryLabel = (value) => {
  const normalizedValue = String(value ?? "others").trim();
  if (!normalizedValue) return "Others";

  return normalizedValue
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Reports() {
  const { transactionList, isTransactionLoading } = useTransaction();
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));

  const currentMonthStart = startOfMonth(new Date());
  const canGoNextMonth = selectedMonth < currentMonthStart;

  const selectedMonthTransactions = useMemo(() => (
    transactionList.filter((transaction) => {
      if (!transaction?.created_at) return false;
      const transactionDate = toDate(transaction.created_at);
      if (!transactionDate) return false;
      return isSameMonth(transactionDate, selectedMonth);
    })
  ), [selectedMonth, transactionList]);

  const reportSummary = useMemo(() => {
    const initialSummary = {
      income: 0,
      expense: 0,
      incomeCount: 0,
      expenseCount: 0
    };

    return selectedMonthTransactions.reduce((summary, transaction) => {
      const amount = Math.max(0, Number(transaction.price ?? 0));

      if (isIncomeTransaction(transaction)) {
        return {
          ...summary,
          income: summary.income + amount,
          incomeCount: summary.incomeCount + 1
        };
      }

      return {
        ...summary,
        expense: summary.expense + amount,
        expenseCount: summary.expenseCount + 1
      };
    }, initialSummary);
  }, [selectedMonthTransactions]);

  const netAmount = reportSummary.income - reportSummary.expense;

  const dailyTrendData = useMemo(() => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);

    const dayMap = new Map();

    eachDayOfInterval({ start: monthStart, end: monthEnd }).forEach((day) => {
      dayMap.set(format(day, "yyyy-MM-dd"), {
        dayKey: format(day, "yyyy-MM-dd"),
        label: format(day, "d"),
        income: 0,
        expense: 0
      });
    });

    selectedMonthTransactions.forEach((transaction) => {
      const transactionDate = toDate(transaction.created_at);
      if (!transactionDate) return;

      const dayKey = format(transactionDate, "yyyy-MM-dd");
      const dayEntry = dayMap.get(dayKey);
      if (!dayEntry) return;

      const amount = Math.max(0, Number(transaction.price ?? 0));
      if (isIncomeTransaction(transaction)) {
        dayEntry.income += amount;
      } else {
        dayEntry.expense += amount;
      }
    });

    return Array.from(dayMap.values());
  }, [selectedMonth, selectedMonthTransactions]);

  const categoryPieData = useMemo(() => {
    const categoryMap = new Map();

    selectedMonthTransactions.forEach((transaction) => {
      if (isIncomeTransaction(transaction)) return;

      const category = formatCategoryLabel(transaction.category);
      const currentAmount = categoryMap.get(category) ?? 0;
      const nextAmount = currentAmount + Math.max(0, Number(transaction.price ?? 0));
      categoryMap.set(category, nextAmount);
    });

    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [selectedMonthTransactions]);

  const monthlyCompareData = useMemo(() => ([{
    name: format(selectedMonth, "MMM yyyy"),
    Income: reportSummary.income,
    Expense: reportSummary.expense
  }]), [reportSummary.expense, reportSummary.income, selectedMonth]);

  const topCategoriesData = useMemo(() => (
    categoryPieData
      .slice(0, 6)
      .map((category) => ({
        ...category,
        shortName: category.name.length > 12 ? `${category.name.slice(0, 12)}...` : category.name
      }))
  ), [categoryPieData]);

  return (
    <div className="page-shell page-stack">
      <div className="centerX justify-between">
        <div>
          <p className="text-lg font-bold tracking-wide">Reports</p>
          <p className="text-xs text-muted">Your monthly spending analytics</p>
        </div>

        <div className="centerX gap-1 px-2 py-1 border rounded-lg bg-white">
          <button
            className="p-1"
            onClick={() => setSelectedMonth((month) => addMonths(month, -1))}
            type="button"
          >
            <ChevronLeft size={18} />
          </button>
          <p className="text-sm font-semibold min-w-[110px] text-center">{format(selectedMonth, "MMM yyyy")}</p>
          <button
            className="p-1 disabled:opacity-30"
            onClick={() => setSelectedMonth((month) => (month < currentMonthStart ? addMonths(month, 1) : month))}
            disabled={!canGoNextMonth}
            type="button"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 border rounded-xl bg-white">
          <p className="text-xs text-muted">Income</p>
          <p className="text-base font-bold mt-1">{formatCurrency(reportSummary.income)}</p>
          <p className="text-xs text-muted mt-1">{reportSummary.incomeCount} transactions</p>
        </div>

        <div className="p-4 border rounded-xl bg-white">
          <p className="text-xs text-muted">Expense</p>
          <p className="text-base font-bold mt-1">{formatCurrency(reportSummary.expense)}</p>
          <p className="text-xs text-muted mt-1">{reportSummary.expenseCount} transactions</p>
        </div>

        <div className="p-4 border rounded-xl bg-white">
          <p className="text-xs text-muted">Net Cash Flow</p>
          <p className={`text-base font-bold mt-1 ${netAmount >= 0 ? "text-green-700" : "text-red-700"}`}>
            {formatCurrency(netAmount)}
          </p>
          <p className="text-xs text-muted mt-1">Income minus expense</p>
        </div>

        <div className="p-4 border rounded-xl bg-white">
          <p className="text-xs text-muted">Total Movements</p>
          <p className="text-base font-bold mt-1">{reportSummary.incomeCount + reportSummary.expenseCount}</p>
          <p className="text-xs text-muted mt-1">All transactions in month</p>
        </div>
      </div>

      {
        isTransactionLoading ? (
          <div className="p-8 border rounded-xl bg-white centerXY">
            <p className="text-muted">Loading report data...</p>
          </div>
        ) : selectedMonthTransactions.length === 0 ? (
          <div className="p-8 border rounded-xl bg-white centerXY">
            <p className="text-muted">No transaction data for this month yet.</p>
          </div>
        ) : (
          <>
            <div className="p-4 border rounded-xl bg-white">
              <p className="font-semibold mb-3">Daily Trend</p>
              <div className="w-full h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} dot={false} name="Income" />
                    <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} dot={false} name="Expense" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="p-4 border rounded-xl bg-white">
                <p className="font-semibold mb-3">Category Spend Split</p>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={96}
                        label={({ name, percent }) => `${name} (${Math.round(percent * 100)}%)`}
                      >
                        {
                          categoryPieData.map((entry, index) => (
                            <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))
                        }
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-4 border rounded-xl bg-white">
                <p className="font-semibold mb-3">Top Expense Categories</p>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topCategoriesData} layout="vertical" margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
                      <YAxis type="category" dataKey="shortName" tick={{ fontSize: 12 }} width={92} />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                        {
                          topCategoriesData.map((category, index) => (
                            <Cell key={category.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-xl bg-white">
              <p className="font-semibold mb-3">Income vs Expense</p>
              <div className="w-full h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyCompareData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="Income" fill="#10B981" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="Expense" fill="#EF4444" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )
      }
    </div>
  );
}
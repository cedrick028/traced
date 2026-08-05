/* eslint-disable react/prop-types */
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import useTransaction from "../hooks/useTransaction";
import { isIncomeTransaction } from "../utils/transactionType";

const BudgetContext = createContext();
const DEFAULT_STATUS_LIMITS = {
  onTrackMin: 50000,
  lowMin: 10000
};

const getMonthStart = (dateValue) => {
  const date = new Date(dateValue);
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

const addMonth = (dateValue, amount) => {
  const date = new Date(dateValue);
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

const getDateKey = (dateValue) => {
  const date = new Date(dateValue);
  return `${date.getFullYear()}-${date.getMonth()}`;
}

const getBudgetStorageKey = (userId, dateValue) => (
  `traced-budget-${userId}-${getDateKey(dateValue)}`
);

const getStatusStorageKey = (userId) => (
  `traced-budget-status-${userId}`
);

const normalizeAmount = (value) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

const BudgetProvider = ({ children }) => {
  const { user } = useAuth();
  const { transactionList } = useTransaction();
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [statusLimits, setStatusLimits] = useState(DEFAULT_STATUS_LIMITS);
  const [selectedMonth, setSelectedMonth] = useState(getMonthStart(new Date()));

  const currentMonthStart = getMonthStart(new Date());
  const canGoNextMonth = selectedMonth < currentMonthStart;

  useEffect(() => {
    if (!user?.id) {
      setMonthlyBudget(0);
      return;
    }

    const storageKey = getBudgetStorageKey(user.id, selectedMonth);
    const savedValue = localStorage.getItem(storageKey);
    setMonthlyBudget(normalizeAmount(savedValue));
  }, [user?.id, selectedMonth]);

  useEffect(() => {
    if (!user?.id) {
      setStatusLimits(DEFAULT_STATUS_LIMITS);
      return;
    }

    const statusStorageKey = getStatusStorageKey(user.id);
    const storedStatusLimits = localStorage.getItem(statusStorageKey);

    if (!storedStatusLimits) {
      setStatusLimits(DEFAULT_STATUS_LIMITS);
      return;
    }

    try {
      const parsedStatusLimits = JSON.parse(storedStatusLimits);
      setStatusLimits({
        onTrackMin: normalizeAmount(parsedStatusLimits.onTrackMin),
        lowMin: normalizeAmount(parsedStatusLimits.lowMin)
      });
    } catch {
      setStatusLimits(DEFAULT_STATUS_LIMITS);
    }
  }, [user?.id]);

  const saveMonthlyBudget = (value) => {
    if (!user?.id) return;

    const normalizedBudget = Math.max(0, normalizeAmount(value));
    const storageKey = getBudgetStorageKey(user.id, selectedMonth);

    localStorage.setItem(storageKey, String(normalizedBudget));
    setMonthlyBudget(normalizedBudget);
  }

  const saveStatusLimits = ({ onTrackMin, lowMin }) => {
    if (!user?.id) return;

    const normalizedOnTrackMin = Math.max(0, normalizeAmount(onTrackMin));
    const normalizedLowMin = Math.max(0, Math.min(normalizeAmount(lowMin), normalizedOnTrackMin));

    const nextStatusLimits = {
      onTrackMin: normalizedOnTrackMin,
      lowMin: normalizedLowMin
    };

    localStorage.setItem(getStatusStorageKey(user.id), JSON.stringify(nextStatusLimits));
    setStatusLimits(nextStatusLimits);
  }

  const goToPreviousMonth = useCallback(() => {
    setSelectedMonth((currentMonth) => addMonth(currentMonth, -1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setSelectedMonth((currentMonth) => (
      currentMonth < currentMonthStart ? addMonth(currentMonth, 1) : currentMonth
    ));
  }, [currentMonthStart]);

  const resetToCurrentMonth = useCallback(() => {
    setSelectedMonth(getMonthStart(new Date()));
  }, []);

  const spentThisMonth = useMemo(() => (
    transactionList.reduce((sum, transaction) => {
      if (!transaction?.created_at || isIncomeTransaction(transaction)) {
        return sum;
      }

      const transactionDate = new Date(transaction.created_at);
      const transactionMonthStart = getMonthStart(transactionDate);
      if (transactionMonthStart.getTime() !== selectedMonth.getTime()) return sum;

      return sum + normalizeAmount(transaction.price);
    }, 0)
  ), [selectedMonth, transactionList]);

  const budgetLeft = Math.max(0, monthlyBudget - spentThisMonth);
  const savedAmount = Math.max(0, budgetLeft);

  const budgetStatus = useMemo(() => {
    if (budgetLeft >= statusLimits.onTrackMin) {
      return {
        key: "on_track",
        label: "On Track",
        textClass: "text-green-700",
        bgClass: "bg-green-50",
        borderClass: "border-green-200"
      };
    }

    if (budgetLeft >= statusLimits.lowMin) {
      return {
        key: "low",
        label: "Low",
        textClass: "text-orange-700",
        bgClass: "bg-orange-50",
        borderClass: "border-orange-200"
      };
    }

    return {
      key: "critical",
      label: "Critical",
      textClass: "text-red-700",
      bgClass: "bg-red-50",
      borderClass: "border-red-200"
    };
  }, [budgetLeft, statusLimits.lowMin, statusLimits.onTrackMin]);

  const categoryBreakdown = useMemo(() => {
    const breakdownMap = new Map();

    transactionList.forEach((transaction) => {
      if (!transaction?.created_at || isIncomeTransaction(transaction)) return;

      const transactionMonthStart = getMonthStart(transaction.created_at);
      if (transactionMonthStart.getTime() !== selectedMonth.getTime()) return;

      const categoryName = String(transaction.category ?? "others").toLowerCase();
      const currentValue = breakdownMap.get(categoryName) ?? 0;
      breakdownMap.set(categoryName, currentValue + normalizeAmount(transaction.price));
    });

    return Array.from(breakdownMap.entries())
      .map(([category, spent]) => {
        const percentage = spentThisMonth > 0 ? (spent / spentThisMonth) * 100 : 0;

        return {
          category,
          spent,
          percentage,
          isHighSpending: percentage >= 40
        };
      })
      .sort((categoryA, categoryB) => categoryB.spent - categoryA.spent);
  }, [selectedMonth, spentThisMonth, transactionList]);

  const selectedMonthLabel = selectedMonth.toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric"
  });

  return (
    <BudgetContext.Provider
      value={{
        monthlyBudget,
        spentThisMonth,
        budgetLeft,
        savedAmount,
        budgetStatus,
        statusLimits,
        categoryBreakdown,
        selectedMonth,
        selectedMonthLabel,
        canGoNextMonth,
        saveMonthlyBudget,
        saveStatusLimits,
        goToPreviousMonth,
        goToNextMonth,
        resetToCurrentMonth
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export { BudgetContext, BudgetProvider };

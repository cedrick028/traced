/* eslint-disable react/prop-types */
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import useTransaction from "../hooks/useTransaction";
import useBank from "../hooks/useBank";
import { supabase } from "../service/supabase";
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

const getMonthStartValue = (dateValue) => {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
}

const normalizeAmount = (value) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

const BudgetProvider = ({ children }) => {
  const { user } = useAuth();
  const { transactionList } = useTransaction();
  const { bankList } = useBank();
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

    let isActive = true;

    const getMonthlyBudget = async () => {
      const { data, error } = await supabase
        .from("budget_monthly")
        .select("monthly_budget")
        .eq("user_id", user.id)
        .eq("month_start", getMonthStartValue(selectedMonth))
        .maybeSingle();

      if (!isActive) return;

      if (error) {
        console.log(error);
        setMonthlyBudget(0);
        return;
      }

      setMonthlyBudget(normalizeAmount(data?.monthly_budget));
    }

    getMonthlyBudget();

    return () => {
      isActive = false;
    };
  }, [user?.id, selectedMonth]);

  useEffect(() => {
    if (!user?.id) {
      setStatusLimits(DEFAULT_STATUS_LIMITS);
      return;
    }

    let isActive = true;

    const getStatusLimits = async () => {
      const { data, error } = await supabase
        .from("budget_status_limits")
        .select("on_track_min, low_min")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!isActive) return;

      if (error) {
        console.log(error);
        setStatusLimits(DEFAULT_STATUS_LIMITS);
        return;
      }

      if (!data) {
        setStatusLimits(DEFAULT_STATUS_LIMITS);
        return;
      }

      setStatusLimits({
        onTrackMin: normalizeAmount(data.on_track_min),
        lowMin: normalizeAmount(data.low_min)
      });
    }

    getStatusLimits();

    return () => {
      isActive = false;
    };
  }, [user?.id]);

  const saveMonthlyBudget = async (value) => {
    if (!user?.id) return;

    const normalizedBudget = Math.max(0, normalizeAmount(value));

    setMonthlyBudget(normalizedBudget);

    const { error } = await supabase
      .from("budget_monthly")
      .upsert({
        user_id: user.id,
        month_start: getMonthStartValue(selectedMonth),
        monthly_budget: normalizedBudget
      }, {
        onConflict: "user_id,month_start"
      });

    if (error) {
      console.log(error);
      setMonthlyBudget((currentBudget) => currentBudget);
    }
  }

  const saveStatusLimits = async ({ onTrackMin, lowMin }) => {
    if (!user?.id) return;

    const normalizedOnTrackMin = Math.max(0, normalizeAmount(onTrackMin));
    const normalizedLowMin = Math.max(0, Math.min(normalizeAmount(lowMin), normalizedOnTrackMin));

    const nextStatusLimits = {
      onTrackMin: normalizedOnTrackMin,
      lowMin: normalizedLowMin
    };

    setStatusLimits(nextStatusLimits);

    const { error } = await supabase
      .from("budget_status_limits")
      .upsert({
        user_id: user.id,
        on_track_min: normalizedOnTrackMin,
        low_min: normalizedLowMin
      }, {
        onConflict: "user_id"
      });

    if (error) {
      console.log(error);
    }
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
  const hasNoAccounts = bankList.length === 0;
  const hasNoTransactions = transactionList.length === 0;
  const isBudgetUnset = monthlyBudget <= 0;

  const budgetStatus = useMemo(() => {
    if (hasNoAccounts && hasNoTransactions && isBudgetUnset) {
      return {
        key: "setup",
        label: "Set up profile",
        textClass: "text-slate-700",
        bgClass: "bg-slate-50",
        borderClass: "border-slate-200"
      };
    }

    if (isBudgetUnset) {
      return {
        key: "no_budget",
        label: "Set budget",
        textClass: "text-blue-700",
        bgClass: "bg-blue-50",
        borderClass: "border-blue-200"
      };
    }

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
  }, [budgetLeft, hasNoAccounts, hasNoTransactions, isBudgetUnset, statusLimits.lowMin, statusLimits.onTrackMin]);

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

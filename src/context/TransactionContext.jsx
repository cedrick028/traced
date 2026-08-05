/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { supabase } from "../service/supabase";
import useAuth from "../hooks/useAuth";
import { isIncomeTransaction } from "../utils/transactionType";

const TransactionContext = createContext()

const normalizeAmount = (value) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

const isUserScopedInsertError = (error) => {
  const message = `${error?.message ?? ""} ${error?.details ?? ""}`.toLowerCase();
  return (
    error?.code === "42501"
    || message.includes("permission")
    || message.includes("rls")
    || message.includes("user_id")
    || message.includes("created_by")
    || message.includes("null value")
  );
}

const TransactionProvider = ({ children }) => {
  const [transactionList, setTransactionList] = useState([])
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const { user } = useAuth();

  const insertTransaction = async (payload) => {
    let query = supabase
      .from("transactions")
      .insert(payload)
      .select()
      .single();

    let { data, error } = await query;

    if (error && user?.id && isUserScopedInsertError(error)) {
      query = supabase
        .from("transactions")
        .insert({ ...payload, created_by: user.id })
        .select()
        .single();

      ({ data, error } = await query);
    }

    if (error) {
      console.error("Transaction insert failed", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
    }

    return { data, error };
  }

  useEffect(() => {
    if (!user?.id) { // To check whether a user has logged in or not to reset transaction list
      setTransactionList([]);
      return;
    }

    const getTransactionList = async () => {
      setIsTransactionLoading(true)

      try {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")

        if (error) throw error

        const sortedTransactions = [...(data ?? [])].sort((transactionA, transactionB) => {
          const dateA = new Date(transactionA.created_at ?? 0).getTime();
          const dateB = new Date(transactionB.created_at ?? 0).getTime();
          return dateB - dateA;
        });

        setTransactionList(sortedTransactions)
      } catch (error) {
        console.log(error)
      } finally {
        setIsTransactionLoading(false)
      }
    }

    getTransactionList();
  }, [user?.id])

  const addExpenseTransaction = async ({ item, category, quantity, pricePerPiece, bank }) => {
    const normalizedQuantity = Math.max(1, normalizeAmount(quantity));
    const normalizedPrice = Math.max(0, normalizeAmount(pricePerPiece));
    const totalPrice = normalizedQuantity * normalizedPrice;

    const payload = {
      item,
      quantity: normalizedQuantity,
      price_per_piece: normalizedPrice,
      price: totalPrice,
      bank,
      created_by: user?.id,
      category: String(category ?? "Others").trim() || "Others",
      note: null
    };

    const { data, error } = await insertTransaction(payload);

    if (!error && data) {
      setTransactionList((currentList) => [data, ...currentList]);
    }

    return { data, error };
  }

  const addIncomeTransaction = async ({ amount, bank }) => {
    const normalizedAmount = Math.max(0, normalizeAmount(amount));

    const payload = {
      item: "Add money",
      quantity: 1,
      price_per_piece: normalizedAmount,
      price: normalizedAmount,
      bank,
      created_by: user?.id,
      category: "income",
      note: null
    };

    const { data, error } = await insertTransaction(payload);

    if (!error && data) {
      setTransactionList((currentList) => [data, ...currentList]);
    }

    return { data, error };
  }

  const updateTransaction = async (transactionId, updateFields) => {
    const { data, error } = await supabase
      .from("transactions")
      .update(updateFields)
      .eq("id", transactionId)
      .select()
      .single();

    if (!error && data) {
      setTransactionList((currentList) => currentList.map((transaction) => (
        transaction.id === transactionId ? data : transaction
      )));
    }

    return { data, error };
  }

  const deleteTransaction = async (transactionId) => {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", transactionId);

    if (!error) {
      setTransactionList((currentList) => (
        currentList.filter((transaction) => transaction.id !== transactionId)
      ));
    }

    return { error };
  }

  return (
    <TransactionContext.Provider
      value={{
        transactionList,
        isTransactionLoading,
        addExpenseTransaction,
        addIncomeTransaction,
        updateTransaction,
        deleteTransaction
      }}
    >
      { children }
    </TransactionContext.Provider>
  )
}

export { TransactionContext, TransactionProvider }
export { isIncomeTransaction }
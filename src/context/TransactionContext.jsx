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

const TransactionProvider = ({ children }) => {
  const [transactionList, setTransactionList] = useState([])
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const { user } = useAuth();

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

  const addExpenseTransaction = async ({ item, quantity, pricePerPiece, bank, bankId }) => {
    const normalizedQuantity = Math.max(1, normalizeAmount(quantity));
    const normalizedPrice = Math.max(0, normalizeAmount(pricePerPiece));
    const totalPrice = normalizedQuantity * normalizedPrice;

    const payload = {
      item,
      quantity: normalizedQuantity,
      price_per_piece: normalizedPrice,
      price: totalPrice,
      bank,
      bank_id: bankId,
      category: "expense",
      type: "expense"
    };

    const { data, error } = await supabase
      .from("transactions")
      .insert(payload)
      .select()
      .single();

    if (!error && data) {
      setTransactionList((currentList) => [data, ...currentList]);
    }

    return { data, error };
  }

  const addIncomeTransaction = async ({ amount, bank, bankId }) => {
    const normalizedAmount = Math.max(0, normalizeAmount(amount));

    const payload = {
      item: "Add money",
      quantity: 1,
      price_per_piece: normalizedAmount,
      price: normalizedAmount,
      bank,
      bank_id: bankId,
      category: "income",
      type: "income"
    };

    const { data, error } = await supabase
      .from("transactions")
      .insert(payload)
      .select()
      .single();

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
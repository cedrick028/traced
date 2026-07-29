/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { supabase } from "../service/supabase";
import useAuth from "../hooks/useAuth";

const TransactionContext = createContext()

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

        setTransactionList(data)
      } catch (error) {
        console.log(error)
      } finally {
        setIsTransactionLoading(false)
      }
    }

    getTransactionList();
  }, [user?.id])

  return (
    <TransactionContext.Provider value={{ transactionList, isTransactionLoading }} >
      { children }
    </TransactionContext.Provider>
  )
}

export { TransactionContext, TransactionProvider }
/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { supabase } from "../service/supabase";
import useAuth from "../hooks/useAuth";

const BankContext = createContext()

const BankProvider = ({ children }) => {
  const [bankList, setBankList] = useState([])
  const [isBankLoading, setIsBankLoading] = useState(false)
  const { user } = useAuth();

  useEffect(() => {

    if (!user?.id) {
      setBankList([]);
      return;
    }

    const getBankList = async () => {
      setIsBankLoading(true)
      try {
        const {data, error} = await supabase
          .from("banks")
          .select("*")

        if (error) throw error;

        setBankList(data)
      } catch (error) {
        console.log(error)
      } finally {
        setIsBankLoading(false)
      }
    }

    getBankList();
  }, [user?.id])


  return (
    <BankContext.Provider value={{ bankList, isBankLoading }} >
      { children }
    </BankContext.Provider>
  )
}

export { BankContext, BankProvider }
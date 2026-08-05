/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { supabase } from "../service/supabase";
import useAuth from "../hooks/useAuth";

const BankContext = createContext()

const normalizeAmount = (value) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

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

        const sortedBanks = [...(data ?? [])].sort((bankA, bankB) => {
          const dateA = new Date(bankA.created_at ?? 0).getTime();
          const dateB = new Date(bankB.created_at ?? 0).getTime();
          return dateB - dateA;
        });

        setBankList(sortedBanks)
      } catch (error) {
        console.log(error)
      } finally {
        setIsBankLoading(false)
      }
    }

    getBankList();
  }, [user?.id])

  const addBank = async ({ bankName, cardType, balance }) => {
    const payload = {
      bank_name: bankName,
      card_type: cardType,
      balance: normalizeAmount(balance)
    };

    const { data, error } = await supabase
      .from("banks")
      .insert(payload)
      .select()
      .single();

    if (!error && data) {
      setBankList((currentList) => [data, ...currentList]);
    }

    return { data, error };
  }

  const updateBank = async (bankId, updateFields) => {
    const { data, error } = await supabase
      .from("banks")
      .update(updateFields)
      .eq("id", bankId)
      .select()
      .single();

    if (!error && data) {
      setBankList((currentList) => currentList.map((bank) => (
        bank.id === bankId ? data : bank
      )));
    }

    return { data, error };
  }

  const deleteBank = async (bankId) => {
    const { error } = await supabase
      .from("banks")
      .delete()
      .eq("id", bankId);

    if (!error) {
      setBankList((currentList) => currentList.filter((bank) => bank.id !== bankId));
    }

    return { error };
  }

  const adjustBankBalance = async (bankId, amountDelta) => {
    const { data: selectedBank, error: findError } = await supabase
      .from("banks")
      .select("id, balance")
      .eq("id", bankId)
      .single();

    if (findError || !selectedBank) {
      return { error: findError ?? new Error("Bank account not found") };
    }

    const existingBalance = normalizeAmount(selectedBank.balance);
    const updatedBalance = Math.max(0, existingBalance + normalizeAmount(amountDelta));

    const { data, error } = await supabase
      .from("banks")
      .update({ balance: updatedBalance })
      .eq("id", bankId)
      .select()
      .single();

    if (!error && data) {
      setBankList((currentList) => currentList.map((bank) => (
        bank.id === bankId ? data : bank
      )));
    }

    return { data, error };
  }

  const totalBalance = bankList.reduce((sum, bank) => (
    sum + normalizeAmount(bank.balance)
  ), 0);


  return (
    <BankContext.Provider
      value={{
        bankList,
        isBankLoading,
        totalBalance,
        addBank,
        updateBank,
        deleteBank,
        adjustBankBalance
      }}
    >
      { children }
    </BankContext.Provider>
  )
}

export { BankContext, BankProvider }
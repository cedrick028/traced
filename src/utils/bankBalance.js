import { isIncomeTransaction } from "./transactionType";

const normalizeAmount = (value) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

const matchesBank = (bank, transaction) => {
  return String(transaction?.bank ?? "").toLowerCase() === String(bank?.bank_name ?? "").toLowerCase();
}

export const getBankBalance = (bank, transactionList = []) => {
  const openingBalance = normalizeAmount(bank?.balance);

  const transactionDelta = transactionList.reduce((sum, transaction) => {
    if (!matchesBank(bank, transaction)) return sum;

    const price = normalizeAmount(transaction?.price);
    return sum + (isIncomeTransaction(transaction) ? price : -price);
  }, 0);

  return Math.max(0, openingBalance + transactionDelta);
}

export const getTotalBalance = (bankList = [], transactionList = []) => {
  return bankList.reduce((sum, bank) => sum + getBankBalance(bank, transactionList), 0);
}
const toLowerText = (value) => String(value ?? "").toLowerCase();

export const isIncomeTransaction = (transaction) => {
  const transactionType = toLowerText(transaction?.type);
  const transactionCategory = toLowerText(transaction?.category);
  const transactionItem = toLowerText(transaction?.item);

  return transactionType === "income"
    || transactionCategory === "income"
    || transactionItem.includes("add money");
}

import { useEffect, useMemo, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import { FunnelX, ReceiptText, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import EmptyState from "../../components/UI/empty/EmptyState";
import TransactionData from "../../components/layout/section/transaction section/TransactionData";
import useTransaction from "../../hooks/useTransaction";
import { isIncomeTransaction } from "../../utils/transactionType";
import ChipContainer from "./ChipContainer";

const TRANSACTION_CATEGORIES = [
  "Others",
  "Grocery",
  "Food",
  "Shopping",
  "Utilities",
  "Transportation",
  "Subscriptions",
  "Entertainment",
  "Income",
  "Expense"
];

const getDayKey = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "unknown";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const getDateHeaderLabel = (dateValue) => {
  const date = new Date(dateValue);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayDiff = Math.round((today - targetDay) / 86400000);

  if (dayDiff === 0) return "Today";
  if (dayDiff === 1) return "Yesterday";

  const isCurrentYear = date.getFullYear() === now.getFullYear();

  return date.toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    ...(isCurrentYear ? {} : { year: "numeric" })
  });
}

export default function Transactions() {
  const { transactionList, isTransactionLoading, deleteTransaction, updateTransaction } = useTransaction();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isUpdatingTransaction, setIsUpdatingTransaction] = useState(false);
  const [deletingTransactionId, setDeletingTransactionId] = useState(null);
  const [isDeletingTransaction, setIsDeletingTransaction] = useState(false);
  const [filterError, setFilterError] = useState("");
  const [editError, setEditError] = useState("");
  const [editForm, setEditForm] = useState({
    category: "Others",
    quantity: "1",
    pricePerPiece: "",
    amount: ""
  });
  const [advancedFilter, setAdvancedFilter] = useState({
    mode: "none",
    date: "",
    month: "",
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    const preset = searchParams.get("preset");

    if (preset === "today") {
      const today = new Date().toISOString().slice(0, 10);
      setAdvancedFilter((currentFilter) => ({
        ...currentFilter,
        mode: "date",
        date: today
      }));

      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("preset");
      setSearchParams(nextParams);
    }
  }, [searchParams, setSearchParams]);

  const isAdvancedFilterActive = advancedFilter.mode !== "none";

  const filteredTransactions = useMemo(() => {
    if (selectedFilter === "all") return transactionList;

    return transactionList.filter((transaction) => {
      const income = isIncomeTransaction(transaction);
      return selectedFilter === "income" ? income : !income;
    });
  }, [selectedFilter, transactionList]);

  const filteredByDateTransactions = useMemo(() => (
    filteredTransactions.filter((transaction) => {
      if (advancedFilter.mode === "none") return true;
      if (!transaction?.created_at) return false;

      const transactionDay = getDayKey(transaction.created_at);
      const transactionMonth = transactionDay.slice(0, 7);

      if (advancedFilter.mode === "date") {
        return transactionDay === advancedFilter.date;
      }

      if (advancedFilter.mode === "month") {
        return transactionMonth === advancedFilter.month;
      }

      if (advancedFilter.mode === "range") {
        if (!advancedFilter.startDate || !advancedFilter.endDate) return true;
        return transactionDay >= advancedFilter.startDate && transactionDay <= advancedFilter.endDate;
      }

      return true;
    })
  ), [filteredTransactions, advancedFilter]);

  const groupedTransactions = useMemo(() => {
    const sortedTransactions = [...filteredByDateTransactions].sort((transactionA, transactionB) => {
      const dateA = new Date(transactionA?.created_at ?? 0).getTime();
      const dateB = new Date(transactionB?.created_at ?? 0).getTime();
      return dateB - dateA;
    });

    const groups = [];
    const groupMap = new Map();

    sortedTransactions.forEach((transaction) => {
      const dayKey = transaction?.created_at ? getDayKey(transaction.created_at) : "unknown";
      const dayLabel = transaction?.created_at ? getDateHeaderLabel(transaction.created_at) : "No date";
      const existingGroup = groupMap.get(dayKey);

      if (existingGroup) {
        existingGroup.items.push(transaction);
      } else {
        const group = {
          key: dayKey,
          label: dayLabel,
          items: [transaction]
        };

        groups.push(group);
        groupMap.set(dayKey, group);
      }
    });

    return groups;
  }, [filteredByDateTransactions]);

  const clearAdvancedFilter = () => {
    setAdvancedFilter({
      mode: "none",
      date: "",
      month: "",
      startDate: "",
      endDate: ""
    });
    setFilterError("");
  }

  const applyAdvancedFilter = () => {
    if (advancedFilter.mode === "date" && !advancedFilter.date) {
      setFilterError("Please select a specific date.");
      return;
    }

    if (advancedFilter.mode === "month" && !advancedFilter.month) {
      setFilterError("Please select a specific month.");
      return;
    }

    if (advancedFilter.mode === "range") {
      if (!advancedFilter.startDate || !advancedFilter.endDate) {
        setFilterError("Please choose both start and end date.");
        return;
      }

      if (advancedFilter.startDate > advancedFilter.endDate) {
        setFilterError("Start date must be earlier than or equal to end date.");
        return;
      }
    }

    setFilterError("");
    setIsFilterOpen(false);
  }

  const openEditModal = (transaction) => {
    const isIncome = isIncomeTransaction(transaction);
    const currentQuantity = Number(transaction.quantity || 1);
    const currentAmount = Number(transaction.price || 0);
    const currentPricePerPiece = Number(
      transaction.price_per_piece
      || (currentQuantity > 0 ? currentAmount / currentQuantity : currentAmount)
    );

    setEditingTransaction(transaction);
    setEditForm({
      category: String(transaction.category ?? "Others"),
      quantity: String(Math.max(1, currentQuantity)),
      pricePerPiece: String(Math.max(0, currentPricePerPiece)),
      amount: String(Math.max(0, currentAmount))
    });

    if (isIncome) {
      setEditForm((currentForm) => ({
        ...currentForm,
        quantity: "1"
      }));
    }

    setEditError("");
  }

  const closeEditModal = () => {
    setEditingTransaction(null);
    setEditForm({ category: "Others", quantity: "1", pricePerPiece: "", amount: "" });
    setEditError("");
  }

  const openDeleteTransactionModal = (transactionId) => {
    setDeletingTransactionId(transactionId);
  }

  const closeDeleteTransactionModal = () => {
    if (isDeletingTransaction) return;
    setDeletingTransactionId(null);
  }

  const handleDeleteTransaction = async () => {
    if (!deletingTransactionId || isDeletingTransaction) return;

    setIsDeletingTransaction(true);
    await deleteTransaction(deletingTransactionId);
    setIsDeletingTransaction(false);
    setDeletingTransactionId(null);
  }

  const handleUpdateTransaction = async (event) => {
    event.preventDefault();
    if (!editingTransaction || isUpdatingTransaction) return;

    const wasIncome = isIncomeTransaction(editingTransaction);
    const normalizedCategory = String(editForm.category ?? "").trim();

    if (!normalizedCategory) {
      setEditError("Please select a category.");
      return;
    }

    let nextAmount = 0;
    let updateFields = {
      category: normalizedCategory
    };

    if (wasIncome) {
      const normalizedAmount = Number(editForm.amount || 0);

      if (!Number.isFinite(normalizedAmount) || normalizedAmount < 0) {
        setEditError("Amount must be 0 or higher.");
        return;
      }

      nextAmount = normalizedAmount;
      updateFields = {
        ...updateFields,
        quantity: 1,
        price_per_piece: normalizedAmount,
        price: normalizedAmount
      };
    } else {
      const normalizedQuantity = Number(editForm.quantity || 1);
      const normalizedPricePerPiece = Number(editForm.pricePerPiece || 0);

      if (!Number.isFinite(normalizedQuantity) || normalizedQuantity < 1) {
        setEditError("Quantity must be at least 1.");
        return;
      }

      if (!Number.isFinite(normalizedPricePerPiece) || normalizedPricePerPiece < 0) {
        setEditError("Price per piece must be 0 or higher.");
        return;
      }

      nextAmount = normalizedQuantity * normalizedPricePerPiece;
      updateFields = {
        ...updateFields,
        quantity: normalizedQuantity,
        price_per_piece: normalizedPricePerPiece,
        price: nextAmount
      };
    }

    setEditError("");

    setIsUpdatingTransaction(true);

    const { error: updateError } = await updateTransaction(editingTransaction.id, updateFields);

    if (!updateError) {
      closeEditModal();
    } else {
      setEditError("Unable to update transaction. Please try again.");
    }

    setIsUpdatingTransaction(false);
  }

  return (
    <div className="page-shell page-stack">
      <ChipContainer
        selectedFilter={selectedFilter}
        onChange={setSelectedFilter}
        onOpenFilter={() => setIsFilterOpen(true)}
        isAdvancedFilterActive={isAdvancedFilterActive}
      />

      {
        isFilterOpen && (
          <div className="fixed inset-0 z-50 bg-primary/35 backdrop-blur-sm p-4 centerXY">
            <div className="w-full max-w-md bg-white border rounded-xl p-4">
              <div className="centerX justify-between">
                <p className="font-bold">Custom filter</p>
                <button type="button" onClick={() => setIsFilterOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="mt-3">
                <p className="text-xs text-muted">Filter type</p>
                <select
                  className="w-full h-11 px-3 border rounded-lg mt-1"
                  value={advancedFilter.mode}
                  onChange={(event) => {
                    setAdvancedFilter((currentFilter) => ({ ...currentFilter, mode: event.target.value }));
                    if (filterError) setFilterError("");
                  }}
                >
                  <option value="none">None</option>
                  <option value="date">Specific date</option>
                  <option value="month">Specific month</option>
                  <option value="range">Date range</option>
                </select>
              </div>

              {
                advancedFilter.mode === "date" && (
                  <input
                    type="date"
                    className="w-full h-11 px-3 border rounded-lg mt-3"
                    value={advancedFilter.date}
                    onChange={(event) => {
                      setAdvancedFilter((currentFilter) => ({ ...currentFilter, date: event.target.value }));
                      if (filterError) setFilterError("");
                    }}
                  />
                )
              }

              {
                advancedFilter.mode === "month" && (
                  <input
                    type="month"
                    className="w-full h-11 px-3 border rounded-lg mt-3"
                    value={advancedFilter.month}
                    onChange={(event) => {
                      setAdvancedFilter((currentFilter) => ({ ...currentFilter, month: event.target.value }));
                      if (filterError) setFilterError("");
                    }}
                  />
                )
              }

              {
                advancedFilter.mode === "range" && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <input
                      type="date"
                      className="w-full h-11 px-3 border rounded-lg"
                      value={advancedFilter.startDate}
                      onChange={(event) => {
                        setAdvancedFilter((currentFilter) => ({ ...currentFilter, startDate: event.target.value }));
                        if (filterError) setFilterError("");
                      }}
                    />
                    <input
                      type="date"
                      className="w-full h-11 px-3 border rounded-lg"
                      value={advancedFilter.endDate}
                      onChange={(event) => {
                        setAdvancedFilter((currentFilter) => ({ ...currentFilter, endDate: event.target.value }));
                        if (filterError) setFilterError("");
                      }}
                    />
                  </div>
                )
              }

              {
                filterError && <p className="text-danger text-xs mt-2">{filterError}</p>
              }

              <button
                type="button"
                className="w-full h-11 border rounded-lg mt-3"
                onClick={clearAdvancedFilter}
              >
                Clear filter
              </button>

              <button
                type="button"
                className="w-full h-11 text-white bg-primary rounded-lg mt-2"
                onClick={applyAdvancedFilter}
              >
                Apply
              </button>
            </div>
          </div>
        )
      }

      {
        deletingTransactionId && (
          <div className="fixed inset-0 z-50 bg-primary/35 backdrop-blur-sm p-4 centerXY">
            <div className="w-full max-w-md bg-white border rounded-xl p-4">
              <div className="centerX justify-between">
                <p className="font-bold">Delete transaction</p>
                <button type="button" onClick={closeDeleteTransactionModal} disabled={isDeletingTransaction}>
                  <X size={18} />
                </button>
              </div>

              <p className="text-sm text-muted mt-3">Are you sure you want to delete this transaction? This action cannot be undone.</p>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  type="button"
                  className="h-11 border rounded-lg"
                  onClick={closeDeleteTransactionModal}
                  disabled={isDeletingTransaction}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="h-11 rounded-lg bg-danger text-white disabled:opacity-60"
                  onClick={handleDeleteTransaction}
                  disabled={isDeletingTransaction}
                >
                  {
                    isDeletingTransaction ? (
                      <span className="centerXY">
                        <CircularProgress size={18} sx={{ color: "#FFFFFF" }} />
                      </span>
                    ) : (
                      "Delete"
                    )
                  }
                </button>
              </div>
            </div>
          </div>
        )
      }

      {
        editingTransaction && (
          <div className="fixed inset-0 z-50 bg-primary/35 backdrop-blur-sm p-4 centerXY">
            <form className="w-full max-w-md bg-white border rounded-xl p-4" onSubmit={handleUpdateTransaction}>
              <div className="centerX justify-between">
                <p className="font-bold">Update transaction</p>
                <button type="button" onClick={closeEditModal}>
                  <X size={18} />
                </button>
              </div>

              <div className="mt-3">
                <p className="text-xs text-muted">Category</p>
                <select
                  className="w-full h-11 px-3 border rounded-lg mt-1"
                  value={editForm.category}
                  onChange={(event) => {
                    setEditForm((currentForm) => ({ ...currentForm, category: event.target.value }));
                    if (editError) setEditError("");
                  }}
                  required
                >
                  {
                    TRANSACTION_CATEGORIES.map((categoryOption) => (
                      <option key={categoryOption} value={categoryOption}>{categoryOption}</option>
                    ))
                  }
                </select>
              </div>

              {
                isIncomeTransaction(editingTransaction) ? (
                  <div className="mt-3">
                    <p className="text-xs text-muted">Amount</p>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full h-11 px-3 border rounded-lg mt-1"
                      value={editForm.amount}
                      onChange={(event) => {
                        setEditForm((currentForm) => ({ ...currentForm, amount: event.target.value }));
                        if (editError) setEditError("");
                      }}
                      required
                    />
                  </div>
                ) : (
                  <>
                    <div className="mt-3">
                      <p className="text-xs text-muted">Quantity</p>
                      <input
                        type="number"
                        min="1"
                        className="w-full h-11 px-3 border rounded-lg mt-1"
                        value={editForm.quantity}
                        onChange={(event) => {
                          setEditForm((currentForm) => ({ ...currentForm, quantity: event.target.value }));
                          if (editError) setEditError("");
                        }}
                        required
                      />
                    </div>

                    <div className="mt-2">
                      <p className="text-xs text-muted">Price per piece</p>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full h-11 px-3 border rounded-lg mt-1"
                        value={editForm.pricePerPiece}
                        onChange={(event) => {
                          setEditForm((currentForm) => ({ ...currentForm, pricePerPiece: event.target.value }));
                          if (editError) setEditError("");
                        }}
                        required
                      />
                    </div>
                  </>
                )
              }

              {
                editError && <p className="text-danger text-xs mt-2">{editError}</p>
              }

              <button
                type="submit"
                className="w-full h-11 mt-3 rounded-lg text-white bg-primary disabled:opacity-60"
                disabled={isUpdatingTransaction}
              >
                {
                  isUpdatingTransaction ? (
                    <span className="centerXY">
                      <CircularProgress size={18} sx={{ color: "#FFFFFF" }} />
                    </span>
                  ) : (
                    "Save changes"
                  )
                }
              </button>
            </form>
          </div>
        )
      }

      {
        isTransactionLoading ? (
          <div className="mt-4 flex flex-col gap-3">
            {
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border rounded-xl overflow-hidden">
                  <div className="px-4 py-2 border-b bg-surface">
                    <Skeleton variant="text" width={120} height={28} />
                  </div>
                  <div className="p-4 centerX justify-between">
                    <div className="centerX gap-3">
                      <Skeleton variant="rounded" width={36} height={36} />
                      <div>
                        <Skeleton variant="text" width={130} height={24} />
                        <Skeleton variant="text" width={110} height={18} />
                      </div>
                    </div>
                    <div>
                      <Skeleton variant="text" width={90} height={24} />
                      <Skeleton variant="text" width={60} height={18} />
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        ) : groupedTransactions.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={selectedFilter === "all" ? ReceiptText : FunnelX}
              title={selectedFilter === "all" ? "No transactions yet" : `No ${selectedFilter} transactions`}
              description={(selectedFilter === "all" && !isAdvancedFilterActive)
                ? "Create your first transaction from the dashboard to get started."
                : "Try another filter or add a new transaction."
              }
            />
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {
              groupedTransactions.map((group) => (
                <div key={group.key} className="border rounded-xl overflow-hidden">
                  <p className="px-4 py-2 font-bold bg-surface border-b">{group.label}</p>
                  <div className="divide-y">
                    {
                      group.items.map((transaction) => (
                        <TransactionData
                          key={transaction.id}
                          item={transaction.item}
                          price={transaction.price}
                          bank={transaction.bank}
                          category={transaction.category}
                          type={transaction.type}
                          createdAt={transaction.created_at}
                          onEdit={() => openEditModal(transaction)}
                          onDelete={() => openDeleteTransactionModal(transaction.id)}
                        />
                      ))
                    }
                  </div>
                </div>
              ))
            }
          </div>
        )
      }
    </div>
  )
}
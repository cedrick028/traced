import { Landmark, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import CircularProgress from "@mui/material/CircularProgress";
import { useSearchParams } from "react-router-dom";
import EmptyState from "../../components/UI/empty/EmptyState";
import AccountFormModal from "../../components/layout/section/bank section/AccountFormModal";
import Icon from "../../components/UI/icon/Icon";
import useBank from "../../hooks/useBank"
import useTransaction from "../../hooks/useTransaction";
import { getBankBalance } from "../../utils/bankBalance";
import TransactionData from "../../components/layout/section/transaction section/TransactionData";
import AccountCard from "./AccountCard";

const BANK_OPTIONS = [
  "BPI",
  "BDO",
  "GCash",
  "Maribank",
  "Metrobank",
  "Maya",
  "UnionBank",
  "Wise"
];

export default function Accounts() {
  const { bankList, isBankLoading, deleteBank, updateBank } = useBank();
  const { transactionList, isTransactionLoading } = useTransaction();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedBankId, setSelectedBankId] = useState(null);
  const [deletingBankId, setDeletingBankId] = useState(null);
  const [isDeletingBank, setIsDeletingBank] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [editForm, setEditForm] = useState({
    bankCategory: "",
    bankType: "",
    balance: ""
  });
  const [isUpdatingBank, setIsUpdatingBank] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    if (bankList.length === 0) {
      setSelectedBankId(null);
      return;
    }

    const querySelectedBankId = searchParams.get("accountId");
    if (querySelectedBankId) {
      const matchedQueryAccount = bankList.find((bank) => String(bank.id) === querySelectedBankId);

      if (matchedQueryAccount) {
        setSelectedBankId(matchedQueryAccount.id);
        return;
      }
    }

    const selectedAccountStillExists = bankList.some((bank) => String(bank.id) === String(selectedBankId));

    if (!selectedAccountStillExists) {
      setSelectedBankId(bankList[0].id);
    }
  }, [bankList, selectedBankId, searchParams]);

  const handleSelectAccount = (bankId) => {
    setSelectedBankId(bankId);
    setSearchParams({ accountId: String(bankId) });
  }

  const openDeleteBankModal = (bankId) => {
    setDeletingBankId(bankId);
  }

  const closeDeleteBankModal = () => {
    if (isDeletingBank) return;
    setDeletingBankId(null);
  }

  const handleDeleteBank = async () => {
    if (!deletingBankId || isDeletingBank) return;

    setIsDeletingBank(true);
    await deleteBank(deletingBankId);
    setIsDeletingBank(false);
    setDeletingBankId(null);
  }

  const openEditBankModal = (bank) => {
    setEditingBank(bank);
    setEditForm({
      bankCategory: String(bank?.bank_name ?? ""),
      bankType: String(bank?.card_type ?? bank?.bank_type ?? ""),
      balance: String(bank?.balance ?? "")
    });
    setEditError("");
  }

  const closeEditBankModal = () => {
    if (isUpdatingBank) return;
    setEditingBank(null);
    setEditForm({ bankCategory: "", bankType: "", balance: "" });
    setEditError("");
  }

  const handleUpdateBank = async (event) => {
    event.preventDefault();
    if (!editingBank || isUpdatingBank) return;

    const normalizedBankName = String(editForm.bankCategory ?? "").trim();
    const normalizedCardType = String(editForm.bankType ?? "").trim();
    const normalizedBalance = Number(editForm.balance);

    if (!normalizedBankName || !normalizedCardType) {
      setEditError("Please complete all required fields.");
      return;
    }

    if (!Number.isFinite(normalizedBalance) || normalizedBalance < 0) {
      setEditError("Balance must be 0 or higher.");
      return;
    }

    setEditError("");
    setIsUpdatingBank(true);

    const { error } = await updateBank(editingBank.id, {
      bank_name: normalizedBankName,
      card_type: normalizedCardType,
      balance: normalizedBalance
    });

    setIsUpdatingBank(false);

    if (!error) {
      closeEditBankModal();
    } else {
      setEditError("Unable to update account. Please try again.");
    }
  }

  const selectedBank = useMemo(() => (
    bankList.find((bank) => String(bank.id) === String(selectedBankId))
  ), [bankList, selectedBankId]);

  const selectedBankTransactions = useMemo(() => {
    if (!selectedBank) return [];

    return transactionList.filter((transaction) => {
      if (transaction.bank_id != null) {
        return String(transaction.bank_id) === String(selectedBank.id);
      }

      return String(transaction.bank ?? "").toLowerCase() === String(selectedBank.bank_name ?? "").toLowerCase();
    });
  }, [selectedBank, transactionList]);

  return (
    <div className="page-shell page-stack">
      <div className="centerX justify-between">
        <p className="font-bold">Bank Accounts ({bankList.length})</p>
        <button onClick={() => setIsFormOpen((value) => !value)}>
          <Icon icon={Plus} variant="transparent" />
        </button>
      </div>

      <AccountFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />

      {
        editingBank && (
          <div className="fixed inset-0 z-50 bg-primary/35 backdrop-blur-sm p-4 centerXY">
            <form className="w-full max-w-md bg-white border rounded-xl p-4" onSubmit={handleUpdateBank}>
              <div className="centerX justify-between">
                <p className="font-bold">Update account</p>
                <button type="button" onClick={closeEditBankModal} disabled={isUpdatingBank}>
                  <X size={18} />
                </button>
              </div>

              <select
                className="w-full h-11 px-3 border rounded-lg mt-4"
                value={editForm.bankCategory}
                onChange={(event) => {
                  setEditForm((value) => ({ ...value, bankCategory: event.target.value }));
                  if (editError) setEditError("");
                }}
                required
              >
                <option value="" disabled>Select bank</option>
                {
                  BANK_OPTIONS.map((bankOption) => (
                    <option key={bankOption} value={bankOption}>{bankOption}</option>
                  ))
                }
              </select>

              <input
                className="w-full h-11 px-3 border rounded-lg mt-2"
                placeholder="Bank type"
                value={editForm.bankType}
                onChange={(event) => {
                  setEditForm((value) => ({ ...value, bankType: event.target.value }));
                  if (editError) setEditError("");
                }}
                required
              />

              <input
                className="w-full h-11 px-3 border rounded-lg mt-2"
                placeholder="Balance"
                type="number"
                min="0"
                value={editForm.balance}
                onChange={(event) => {
                  setEditForm((value) => ({ ...value, balance: event.target.value }));
                  if (editError) setEditError("");
                }}
                required
              />

              {
                editError && <p className="text-danger text-xs mt-2">{editError}</p>
              }

              <button
                type="submit"
                className="w-full h-11 text-white bg-primary rounded-lg mt-3 disabled:opacity-60"
                disabled={isUpdatingBank}
              >
                {
                  isUpdatingBank ? (
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
        deletingBankId && (
          <div className="fixed inset-0 z-50 bg-primary/35 backdrop-blur-sm p-4 centerXY">
            <div className="w-full max-w-md bg-white border rounded-xl p-4">
              <div className="centerX justify-between">
                <p className="font-bold">Delete account</p>
                <button type="button" onClick={closeDeleteBankModal} disabled={isDeletingBank}>
                  <X size={18} />
                </button>
              </div>

              <p className="text-sm text-muted mt-3">Are you sure you want to delete this account? This action cannot be undone.</p>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  type="button"
                  className="h-11 border rounded-lg"
                  onClick={closeDeleteBankModal}
                  disabled={isDeletingBank}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="h-11 rounded-lg bg-danger text-white disabled:opacity-60"
                  onClick={handleDeleteBank}
                  disabled={isDeletingBank}
                >
                  {
                    isDeletingBank ? (
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

      <div>
        {
          isBankLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-4 border rounded-lg my-2">
                <div className="centerX justify-between">
                  <div className="centerX gap-3">
                    <Skeleton variant="rounded" width={48} height={48} />
                    <div>
                      <Skeleton variant="text" width={140} height={28} />
                      <Skeleton variant="text" width={100} height={20} />
                    </div>
                  </div>
                  <Skeleton variant="text" width={110} height={28} />
                </div>
              </div>
            ))
          ) : bankList.length === 0 ? (
            <EmptyState
              icon={Landmark}
              title="No bank accounts yet"
              description="Create an account using the plus button to start recording balances."
              className="mt-3"
            />
          ) : (
            bankList.map((bank) => (
              <AccountCard
                key={bank.id}
                bankName={bank.bank_name}
                cardType={bank.card_type ?? bank.bank_type}
                balance={getBankBalance(bank, transactionList)}
                onSelect={() => handleSelectAccount(bank.id)}
                isSelected={String(selectedBankId) === String(bank.id)}
                onEdit={() => openEditBankModal(bank)}
                onDelete={() => openDeleteBankModal(bank.id)}
              />
            ))
          )
        }
      </div>

      {
        !isBankLoading && selectedBank && (
          <div className="mt-6">
            <p className="font-bold">{selectedBank.bank_name} Transactions</p>

            {
              isTransactionLoading ? (
                <div className="mt-2 border rounded-xl overflow-hidden divide-y">
                  {
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="p-4 centerX justify-between">
                        <div className="centerX gap-3">
                          <Skeleton variant="rounded" width={36} height={36} />
                          <div>
                            <Skeleton variant="text" width={130} height={24} />
                            <Skeleton variant="text" width={100} height={18} />
                          </div>
                        </div>
                        <div>
                          <Skeleton variant="text" width={90} height={24} />
                          <Skeleton variant="text" width={60} height={18} />
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) : selectedBankTransactions.length === 0 ? (
                <EmptyState
                  title="No transactions for this account"
                  description="Use this account when adding money or creating a transaction to see records here."
                  className="mt-3"
                />
              ) : (
                <div className="mt-2 border rounded-xl overflow-hidden divide-y">
                  {
                    selectedBankTransactions.map((transaction) => (
                      <TransactionData
                        key={transaction.id}
                        item={transaction.item}
                        price={transaction.price}
                        bank={transaction.bank}
                        category={transaction.category}
                        type={transaction.type}
                        createdAt={transaction.created_at}
                      />
                    ))
                  }
                </div>
              )
            }
          </div>
        )
      }
    </div>
    
  )
}
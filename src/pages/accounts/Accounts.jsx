import { Landmark, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { useSearchParams } from "react-router-dom";
import EmptyState from "../../components/UI/empty/EmptyState";
import AccountFormModal from "../../components/layout/section/bank section/AccountFormModal";
import Icon from "../../components/UI/icon/Icon";
import useBank from "../../hooks/useBank"
import useTransaction from "../../hooks/useTransaction";
import TransactionData from "../../components/layout/section/transaction section/TransactionData";
import AccountCard from "./AccountCard";

export default function Accounts() {
  const { bankList, isBankLoading, deleteBank } = useBank();
  const { transactionList, isTransactionLoading } = useTransaction();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedBankId, setSelectedBankId] = useState(null);

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
                balance={bank.balance}
                onSelect={() => handleSelectAccount(bank.id)}
                isSelected={String(selectedBankId) === String(bank.id)}
                onDelete={() => deleteBank(bank.id)}
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
import Skeleton from "@mui/material/Skeleton";
import { ReceiptText } from "lucide-react";
import useTransaction from "../../../../hooks/useTransaction";
import EmptyState from "../../../UI/empty/EmptyState";
import SectionHeader from "../section header/SectionHeader";
import TransactionData from "./TransactionData";

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

export default function TransactionSection() {
  const { transactionList, isTransactionLoading } = useTransaction();

  const latestTransactions = [...transactionList]
    .sort((transactionA, transactionB) => {
      const dateA = new Date(transactionA?.created_at ?? 0).getTime();
      const dateB = new Date(transactionB?.created_at ?? 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  const groupedTransactions = latestTransactions.reduce((groups, transaction) => {
    const dayKey = transaction?.created_at ? getDayKey(transaction.created_at) : "unknown";
    const dayLabel = transaction?.created_at ? getDateHeaderLabel(transaction.created_at) : "No date";
    const existingGroup = groups.find((group) => group.key === dayKey);

    if (existingGroup) {
      existingGroup.items.push(transaction);
      return groups;
    }

    groups.push({
      key: dayKey,
      label: dayLabel,
      items: [transaction]
    });

    return groups;
  }, []);

  return (
    <div className="mt-10">
      <SectionHeader sectionTitle="Transactions" path="/transactions" />

      <div className="mt-2">
        {
          isTransactionLoading ? (
            <div className="flex flex-col gap-3">
              {
                Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="border rounded-xl overflow-hidden">
                    <div className="px-4 py-2 border-b bg-surface">
                      <Skeleton variant="text" width={120} height={26} />
                    </div>
                    <div className="p-4 centerX justify-between">
                      <div className="centerX gap-3">
                        <Skeleton variant="rounded" width={36} height={36} />
                        <div>
                          <Skeleton variant="text" width={120} height={26} />
                          <Skeleton variant="text" width={100} height={18} />
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
          ) : latestTransactions.length === 0 ? (
            <div className="p-4 border rounded-xl">
              <EmptyState
                icon={ReceiptText}
                title="No transactions yet"
                description="Your recent transactions will appear here after you add one."
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
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
                            category={transaction.category}
                            bank={transaction.bank}
                            type={transaction.type}
                            createdAt={transaction.created_at}
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
    </div>
  )
}
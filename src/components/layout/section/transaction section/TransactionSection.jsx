import Skeleton from "@mui/material/Skeleton";
import { ReceiptText } from "lucide-react";
import useTransaction from "../../../../hooks/useTransaction";
import EmptyState from "../../../UI/empty/EmptyState";
import SectionHeader from "../section header/SectionHeader";
import TransactionData from "./TransactionData";

export default function TransactionSection() {
  const { transactionList, isTransactionLoading } = useTransaction();

  const latestTransactions = transactionList.slice(0, 5);

  return (
    <div className="mt-10">
      <SectionHeader sectionTitle="Transactions" path="/transactions" />

      <div className="flex flex-col border rounded-xl divide-y mt-2">
        {
          isTransactionLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-4 centerX justify-between">
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
            ))
          ) : latestTransactions.length === 0 ? (
            <div className="p-4">
              <EmptyState
                icon={ReceiptText}
                title="No transactions yet"
                description="Your recent transactions will appear here after you add one."
              />
            </div>
          ) : (
            latestTransactions.map((transaction) => (
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
          )
        }
      </div>
    </div>
  )
}
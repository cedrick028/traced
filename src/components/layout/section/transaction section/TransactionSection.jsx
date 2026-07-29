import useTransaction from "../../../../hooks/useTransaction";
import SectionHeader from "../section header/SectionHeader";
import TransactionData from "./TransactionData";

export default function TransactionSection() {
  const { transactionList, isTransactionLoading } = useTransaction();
  return (
    <div className="mt-10">
      <SectionHeader sectionTitle="Transactions" path="/transactions" />

      <div className="flex flex-col border rounded-xl divide-y mt-2">
        {
          isTransactionLoading ? (
            <p>Loading transactions...</p>
          ) : (
            transactionList.map((transaction) => (
              <TransactionData 
                key={transaction.id} 
                item={transaction.item} 
                price={transaction.price} 
                category={transaction.category}
                bank={transaction.bank}              
              />
            ))
          )
        }
      </div>
    </div>
  )
}
import SectionHeader from "../section header/SectionHeader";
import TransactionData from "./TransactionData";

export default function TransactionSection() {
  return (
    <div className="mt-10">
      <SectionHeader sectionTitle="Transactions" />

      <div className="flex flex-col border rounded-xl divide-y mt-2">
        <TransactionData />
        <TransactionData />
        <TransactionData />
        <TransactionData />
      </div>
    </div>
  )
}
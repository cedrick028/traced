import SectionHeader from "../section header/SectionHeader";
import AddAccount from "./AddAccount";
import BankCard from "./BankCard";

export default function BankSection() {
  return (
    <div className="mt-10">
      <SectionHeader sectionTitle="Accounts" />
      <div className="grid grid-cols-2 gap-4 mt-2">
        <BankCard />
        <AddAccount />
      </div>
    </div>
  )
}
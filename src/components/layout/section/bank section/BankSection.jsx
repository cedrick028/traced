import useBank from "../../../../hooks/useBank";
import SectionHeader from "../section header/SectionHeader";
import AddAccount from "./AddAccount";
import BankCard from "./BankCard";

export default function BankSection() {
  const { bankList, isBankLoading } = useBank();
  return (
    <div className="mt-10">
      <SectionHeader sectionTitle="Accounts" />
      <div className="grid grid-cols-2 gap-4 mt-2">
        {
          isBankLoading ? (
            <p>Loading bank...</p>
          ) : (
            bankList.map((bank) => (
              <BankCard key={bank.id} bankName={bank.bank_name} cardType={bank.card_type} />
            ))
          )
        }
        <AddAccount />
      </div>
    </div>
  )
}
import { Plus } from "lucide-react";
import Icon from "../../components/UI/icon/Icon";
import useBank from "../../hooks/useBank"
import AccountCard from "./AccountCard";

export default function Accounts() {
  const { bankList, isBankLoading } = useBank();
  return (
    <div className="p-4">
      <div className="centerX justify-between">
        <p className="font-bold">Bank Accounts ({bankList.length})</p>
        <Icon icon={Plus} variant="transparent" />
      </div>
      <div>
        {
          isBankLoading ? (
            <p>Loading bank...</p>
          ) : (
            bankList.map((bank) => (
              <AccountCard key={bank.id} bankName={bank.bank_name} cardType={bank.card_type} />
            ))
          )
        }
      </div>
    </div>
    
  )
}
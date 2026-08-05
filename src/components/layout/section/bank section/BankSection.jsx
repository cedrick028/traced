import Skeleton from "@mui/material/Skeleton";
import { Landmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useBank from "../../../../hooks/useBank";
import useTransaction from "../../../../hooks/useTransaction";
import { getBankBalance } from "../../../../utils/bankBalance";
import EmptyState from "../../../UI/empty/EmptyState";
import SectionHeader from "../section header/SectionHeader";
import AddAccount from "./AddAccount";
import BankCard from "./BankCard";

export default function BankSection() {
  const { bankList, isBankLoading } = useBank();
  const { transactionList } = useTransaction();
  const navigate = useNavigate();

  const handleViewAccount = (bankId) => {
    navigate(`/accounts?accountId=${bankId}`);
  }

  return (
    <div className="mt-10">
      <SectionHeader sectionTitle="Accounts" path="/accounts" />
      <div className="grid grid-cols-2 gap-4 mt-2">
        {
          isBankLoading ? (
            Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="centerX justify-between">
                  <Skeleton variant="rounded" width={36} height={36} />
                  <Skeleton variant="rounded" width={24} height={24} />
                </div>
                <Skeleton variant="text" width="70%" height={30} sx={{ marginTop: "8px" }} />
                <Skeleton variant="text" width="45%" height={20} />
                <Skeleton variant="text" width="55%" height={28} />
              </div>
            ))
          ) : bankList.length === 0 ? (
            <div className="col-span-2">
              <EmptyState
                icon={Landmark}
                title="No accounts yet"
                description="Add your first bank account to start tracking your balance."
              />
            </div>
          ) : (
            bankList.map((bank) => (
              <BankCard
                key={bank.id}
                bankName={bank.bank_name}
                cardType={bank.card_type ?? bank.bank_type}
                balance={getBankBalance(bank, transactionList)}
                onMoreClick={() => handleViewAccount(bank.id)}
              />
            ))
          )
        }
        {!isBankLoading && <AddAccount />}
      </div>
    </div>
  )
}
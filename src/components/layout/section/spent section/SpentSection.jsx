import { ChevronRight, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useTransaction from "../../../../hooks/useTransaction";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { isIncomeTransaction } from "../../../../utils/transactionType";

export default function SpentSection() {
  const { transactionList } = useTransaction();
  const navigate = useNavigate();

  const now = new Date();
  const todayDate = now.toDateString();

  const totalSpentToday = transactionList.reduce((sum, transaction) => {
    if (!transaction?.created_at || isIncomeTransaction(transaction)) return sum;

    const transactionDate = new Date(transaction.created_at);
    if (transactionDate.toDateString() !== todayDate) return sum;

    return sum + Number(transaction.price || 0);
  }, 0);

  const formattedDate = now.toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric"
  });

  return (
    <div className="w-full centerX justify-between bg-surface p-4 rounded-xl mt-4">
      <div className="centerX gap-3">
        <Info size={22} />
        <div>
          <p className="font-medium">You have spent {formatCurrency(totalSpentToday)} today.</p>
          <p className="text-xs text-muted">{formattedDate}</p>
        </div>
      </div>
      <button type="button" onClick={() => navigate("/transactions?preset=today")}>
        <ChevronRight />
      </button>
    </div>
  )
}
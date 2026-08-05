import ProgressBar from "../../UI/progress bar/ProgressBar";
import useBudget from "../../../hooks/useBudget";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function BudgetSummary() {
  const { monthlyBudget, spentThisMonth, budgetLeft, budgetStatus } = useBudget();

  const progressValue = monthlyBudget > 0
    ? Math.min(100, Math.round((spentThisMonth / monthlyBudget) * 100))
    : 0;

  return (
    <div className="border-b border-x p-4 rounded-b-xl">
      <div className="centerX justify-between">
        <p className="text-xs">Budget left for this month</p>
        <div className="centerX gap-2">
          <p>{formatCurrency(budgetLeft)}</p>
          <div className={`px-2 py-0.5 border rounded-md ${budgetStatus.bgClass} ${budgetStatus.borderClass}`}>
            <p className={`text-[10px] ${budgetStatus.textClass}`}>{budgetStatus.label}</p>
          </div>
        </div>
      </div>
      <ProgressBar variant="light" value={progressValue} />
      <p className="text-xs mt-2">
        {formatCurrency(spentThisMonth)} spent of {formatCurrency(monthlyBudget)}
      </p>
    </div>
  )
}
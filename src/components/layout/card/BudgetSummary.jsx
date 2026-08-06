import ProgressBar from "../../UI/progress bar/ProgressBar";
import { useNavigate } from "react-router-dom";
import useBudget from "../../../hooks/useBudget";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function BudgetSummary() {
  const navigate = useNavigate();
  const { monthlyBudget, spentThisMonth, budgetLeft, budgetStatus } = useBudget();

  const progressValue = monthlyBudget > 0
    ? Math.min(100, (spentThisMonth / monthlyBudget) * 100)
    : 0;
  const statusNavigation = {
    setup: "/accounts",
    no_budget: "/budget"
  };
  const statusRedirectPath = statusNavigation[budgetStatus.key] ?? null;

  return (
    <div className="border-b border-x p-4 rounded-b-xl">
      <div className="centerX justify-between">
        <p className="text-xs">Budget left for this month</p>
        <div className="centerX gap-2">
          <p>{formatCurrency(budgetLeft)}</p>
          {
            statusRedirectPath ? (
              <button
                type="button"
                className={`px-2 py-0.5 border rounded-md ${budgetStatus.bgClass} ${budgetStatus.borderClass}`}
                onClick={() => navigate(statusRedirectPath)}
              >
                <p className={`text-[10px] ${budgetStatus.textClass}`}>{budgetStatus.label}</p>
              </button>
            ) : (
              <div className={`px-2 py-0.5 border rounded-md ${budgetStatus.bgClass} ${budgetStatus.borderClass}`}>
                <p className={`text-[10px] ${budgetStatus.textClass}`}>{budgetStatus.label}</p>
              </div>
            )
          }
        </div>
      </div>
      <ProgressBar variant="light" value={progressValue} />
      <p className="text-xs mt-2">
        {formatCurrency(spentThisMonth)} spent of {formatCurrency(monthlyBudget)}
      </p>
    </div>
  )
}
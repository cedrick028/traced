import ProgressBar from "../../components/UI/progress bar/ProgressBar";
import { useNavigate } from "react-router-dom";
import useBudget from "../../hooks/useBudget";
import { formatCurrency } from "../../utils/formatCurrency";

export default function BudgetBreakdown() {
  const navigate = useNavigate();
  const { monthlyBudget, spentThisMonth, budgetLeft, savedAmount, budgetStatus } = useBudget();
  const progressValue = monthlyBudget > 0
    ? Math.min(100, (spentThisMonth / monthlyBudget) * 100)
    : 0;
  const statusNavigation = {
    setup: "/accounts",
    no_budget: "/budget"
  };
  const statusRedirectPath = statusNavigation[budgetStatus.key] ?? null;

  return (
    <div className="border rounded-xl bg-surface overflow-hidden">
      <div className="p-4">
        <p>Budget left</p>
        <div className="flex items-end justify-between">
          <p className="text-3xl mt-2 leading-none">{formatCurrency(budgetLeft)}</p>
          {
            statusRedirectPath ? (
              <button
                type="button"
                className={`px-3 py-1 border rounded-lg ${budgetStatus.bgClass} ${budgetStatus.borderClass}`}
                onClick={() => navigate(statusRedirectPath)}
              >
                <p className={budgetStatus.textClass}>{budgetStatus.label}</p>
              </button>
            ) : (
              <div className={`px-3 py-1 border rounded-lg ${budgetStatus.bgClass} ${budgetStatus.borderClass}`}>
                <p className={budgetStatus.textClass}>{budgetStatus.label}</p>
              </div>
            )
          }
        </div>
      </div>

      <div className="p-4 bg-white">
        <div>
          <ProgressBar variant="light" value={progressValue} />
        </div>

        <div className="centerX justify-between mt-4">
          <div>
            <p className="text-muted">Spent</p>
            <p className="text-base font-medium">{formatCurrency(spentThisMonth)}</p>
          </div>
          <div>
            <p className="text-muted">Saved</p>
            <p className="text-base font-medium">{formatCurrency(savedAmount)}</p>
          </div>
          <div>
            <p className="text-muted">Total budget</p>
            <p className="text-base font-medium">{formatCurrency(monthlyBudget)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
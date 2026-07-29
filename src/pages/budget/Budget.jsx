import BudgetBreakdown from "./BudgetBreakdown";
import BudgetHeader from "./BudgetHeader";
import BudgetOverview from "./BudgetOverview";

export default function Budget() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <BudgetHeader />
      <BudgetBreakdown />
      <BudgetOverview />
    </div>
  )
}
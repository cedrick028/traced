import EmptyState from "../../components/UI/empty/EmptyState";
import useBudget from "../../hooks/useBudget";
import BudgetCategory from "./BudgetCategory";

export default function BudgetOverview() {
  const { categoryBreakdown } = useBudget();

  return (
    <div className="border rounded-xl p-4">
      <div className="centerX justify-between">
        <p className="font-bold">Budget Overview</p>
        <p className="text-muted">By category</p>
      </div>

      {
        categoryBreakdown.length === 0 ? (
          <EmptyState
            title="No category spending yet"
            description="Expense categories will appear here once transactions are recorded in this month."
            className="mt-3"
          />
        ) : (
          <div className="flex flex-col gap-2 mt-3">
            {
              categoryBreakdown.map((categoryItem) => (
                <BudgetCategory
                  key={categoryItem.category}
                  category={categoryItem.category}
                  spent={categoryItem.spent}
                  percentage={categoryItem.percentage}
                  isHighSpending={categoryItem.isHighSpending}
                />
              ))
            }
          </div>
        )
      }
    </div>
  )
}
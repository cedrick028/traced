import BudgetCategory from "./BudgetCategory";

export default function BudgetOverview() {
  return (
    <div>
      <div className="centerX justify-between">
        <p className="font-bold">Budget Overview</p>
        <p className="text-muted">Update limit</p>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <BudgetCategory category="grocery" />
        <BudgetCategory category="transportation" />
        <BudgetCategory category="utilities" />
        <BudgetCategory category="shopping" />
        <BudgetCategory category="entertainment" />
        <BudgetCategory category="others" />
      </div>
    </div>
  )
}
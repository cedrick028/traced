import { ChevronLeft, ChevronRight } from "lucide-react";
import useBudget from "../../hooks/useBudget";

export default function BudgetHeader() {
  const {
    selectedMonthLabel,
    canGoNextMonth,
    goToPreviousMonth,
    goToNextMonth
  } = useBudget();

  return (
    <div className="centerX justify-between my-2">
      <button type="button" onClick={goToPreviousMonth}>
        <ChevronLeft />
      </button>
      <p className="font-bold">{selectedMonthLabel}</p>
      <button type="button" onClick={goToNextMonth} disabled={!canGoNextMonth} className={!canGoNextMonth ? "opacity-30" : ""}>
        <ChevronRight />
      </button>
    </div>
  )
}
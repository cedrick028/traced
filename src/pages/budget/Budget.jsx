import { useEffect, useState } from "react";
import useBudget from "../../hooks/useBudget";
import BudgetBreakdown from "./BudgetBreakdown";
import BudgetHeader from "./BudgetHeader";
import BudgetOverview from "./BudgetOverview";

export default function Budget() {
  const {
    monthlyBudget,
    selectedMonthLabel,
    statusLimits,
    saveMonthlyBudget,
    saveStatusLimits,
    resetToCurrentMonth
  } = useBudget();
  const [budgetInput, setBudgetInput] = useState(String(monthlyBudget || ""));
  const [statusInput, setStatusInput] = useState({
    onTrackMin: String(statusLimits.onTrackMin),
    lowMin: String(statusLimits.lowMin)
  });
  const [isStatusFormOpen, setIsStatusFormOpen] = useState(false);

  useEffect(() => () => {
    resetToCurrentMonth();
  }, [resetToCurrentMonth]);

  useEffect(() => {
    setBudgetInput(String(monthlyBudget || ""));
  }, [monthlyBudget]);

  useEffect(() => {
    setStatusInput({
      onTrackMin: String(statusLimits.onTrackMin),
      lowMin: String(statusLimits.lowMin)
    });
  }, [statusLimits]);

  const handleSaveBudget = () => {
    saveMonthlyBudget(budgetInput);
  }

  const handleSaveStatusLimits = () => {
    saveStatusLimits({
      onTrackMin: statusInput.onTrackMin,
      lowMin: statusInput.lowMin
    });

    setIsStatusFormOpen(false);
  }

  return (
    <div className="page-shell page-stack">
      <BudgetHeader />

      <div className="p-4 border rounded-xl">
        <p className="font-bold">Budget settings</p>
        <p className="text-xs text-muted mt-1">Set your budget limit for {selectedMonthLabel}.</p>
        <div className="centerX gap-2 mt-3">
          <input
            className="w-full h-11 px-3 border rounded-lg"
            type="number"
            min="0"
            placeholder="Monthly budget"
            value={budgetInput}
            onChange={(event) => setBudgetInput(event.target.value)}
          />
          <button className="h-11 px-4 rounded-lg text-white bg-primary" onClick={handleSaveBudget}>
            Save
          </button>
        </div>
      </div>

      <div className="p-4 border rounded-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="sm:pr-3">
            <p className="font-bold">Budget status limits</p>
            <p className="text-xs text-muted mt-1">Customize thresholds used for On Track, Low, and Critical status.</p>
          </div>
          <button
            className="h-9 px-4 rounded-lg border text-xs whitespace-nowrap shrink-0 self-start"
            onClick={() => setIsStatusFormOpen((value) => !value)}
            type="button"
          >
            {isStatusFormOpen ? "Close" : "Set values"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2 mt-3 text-xs">
          <p className="text-green-700">On Track: {`>=`} {statusLimits.onTrackMin}</p>
          <p className="text-orange-700">Low: {`>=`} {statusLimits.lowMin} and below {statusLimits.onTrackMin}</p>
          <p className="text-red-700">Critical: below {statusLimits.lowMin}</p>
        </div>

        {
          isStatusFormOpen && (
            <div className="mt-3 border rounded-lg p-3">
              <p className="text-xs text-muted">Set your own thresholds (in pesos)</p>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <input
                  className="w-full h-11 px-3 border rounded-lg"
                  type="number"
                  min="0"
                  placeholder="On Track minimum"
                  value={statusInput.onTrackMin}
                  onChange={(event) => setStatusInput((value) => ({ ...value, onTrackMin: event.target.value }))}
                />

                <input
                  className="w-full h-11 px-3 border rounded-lg"
                  type="number"
                  min="0"
                  placeholder="Low minimum"
                  value={statusInput.lowMin}
                  onChange={(event) => setStatusInput((value) => ({ ...value, lowMin: event.target.value }))}
                />
              </div>

              <button
                type="button"
                className="w-full h-11 mt-2 rounded-lg bg-primary text-white"
                onClick={handleSaveStatusLimits}
              >
                Save status limits
              </button>
            </div>
          )
        }
      </div>

      <BudgetBreakdown />
      <BudgetOverview />
    </div>
  )
}
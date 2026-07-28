import ProgressBar from "../../UI/progress bar/ProgressBar";

export default function BudgetSummary() {
  return (
    <div className="border-b border-x p-4 rounded-b-xl">
      <div className="centerX justify-between">
        <p className="text-xs">Budget left for this month</p>
        <p>₱22,360.00</p>
      </div>
      <ProgressBar variant="light" />
      <p className="text-xs mt-2">₱7,040.00 spent of ₱20,000.00</p>
    </div>
  )
}
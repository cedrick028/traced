import ProgressBar from "../../components/UI/progress bar/ProgressBar";

export default function BudgetBreakdown() {
  return (
    <div className="border rounded-xl bg-surface overflow-hidden">
      <div className="p-4">
        <p>Budget left</p>
        <div className="flex items-end justify-between">
          <p className="text-3xl mt-2 leading-none">₱12,960.00</p>
          <div className="px-3 py-1 border rounded-lg bg-white">
            <p>On track</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white">
        <div>
          <ProgressBar variant="light" />
        </div>

        <div className="centerX justify-between mt-4">
          <div>
            <p className="text-muted">Spent</p>
            <p className="text-lg font-medium">₱7,040.00</p>
          </div>
          <div>
            <p className="text-muted">Total budget</p>
            <p className="text-lg font-medium">₱20,000.00</p>
          </div>
        </div>
      </div>
    </div>
  )
}
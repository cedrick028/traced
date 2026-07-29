import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BudgetHeader() {
  return (
    <div className="centerX justify-between my-2">
      <ChevronLeft />
      <p className="font-bold">July 2026</p>
      <ChevronRight />
    </div>
  )
}
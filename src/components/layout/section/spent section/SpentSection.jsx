import { ChevronRight, Info } from "lucide-react";

export default function SpentSection() {
  return (
    <div className="w-full centerX justify-between bg-surface p-4 rounded-xl mt-4">
      <div className="centerX gap-3">
        <Info size={22} />
        <div>
          <p className="font-medium">You have spent ₱1,235.00 today.</p>
          <p className="text-xs text-muted">July 28</p>
        </div>
      </div>
      <ChevronRight />
    </div>
  )
}
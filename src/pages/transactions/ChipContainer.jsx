import { Settings2 } from "lucide-react";
import Chip from "../../components/UI/chip/Chip";
import Icon from "../../components/UI/icon/Icon";

/* eslint-disable react/prop-types */
export default function ChipContainer({ selectedFilter, onChange, onOpenFilter, isAdvancedFilterActive }) {
  return (
    <div className="centerX justify-between">
      <div className="centerX gap-2">
        <Chip label="all" isActive={selectedFilter === "all"} onClick={() => onChange("all")} />
        <Chip label="income" isActive={selectedFilter === "income"} onClick={() => onChange("income")} />
        <Chip label="expense" isActive={selectedFilter === "expense"} onClick={() => onChange("expense")} />
      </div>
      <button type="button" onClick={onOpenFilter} className={isAdvancedFilterActive ? "text-primary" : ""}>
        <Icon icon={Settings2} variant="transparent" />
      </button>
    </div>
  )
}
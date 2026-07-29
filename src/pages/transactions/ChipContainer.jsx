import { Settings2 } from "lucide-react";
import Chip from "../../components/UI/chip/Chip";
import Icon from "../../components/UI/icon/Icon";

export default function ChipContainer() {
  return (
    <div className="centerX justify-between">
      <div className="centerX gap-2">
        <Chip label="all" />
        <Chip label="income" />
        <Chip label="expense" />
      </div>
      <Icon icon={Settings2} variant="transparent" />
    </div>
  )
}
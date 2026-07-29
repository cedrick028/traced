import { Plus } from "lucide-react";
import Icon from "../../../UI/icon/Icon";

export default function AddAccount() {
  return (
    <div className="h-[147px] centerXY flex-col gap-2 p-2 border border-dashed rounded-lg">
      <Icon icon={Plus} variant="primary" />
      <p className="text-xs text-muted">Add account</p>
    </div>
  )
}
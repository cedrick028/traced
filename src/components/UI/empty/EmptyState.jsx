/* eslint-disable react/prop-types */
import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "No data yet",
  description = "Content will appear here once you create new records.",
  icon: Icon = Inbox,
  className = ""
}) {
  return (
    <div className={`w-full centerXY flex-col gap-2 border border-dashed rounded-xl p-6 text-center ${className}`}>
      <Icon size={22} className="text-muted" />
      <p className="font-medium">{title}</p>
      <p className="text-xs text-muted">{description}</p>
    </div>
  )
}

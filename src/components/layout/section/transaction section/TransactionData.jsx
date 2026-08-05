/* eslint-disable react/prop-types */
import { Dot, Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";
import Icon from "../../../UI/icon/Icon";
import { setCategoryIcon } from "../../../../utils/setCategoryIcon";
import { formatString } from "../../../../utils/formatString";
import { formatCurrency } from "../../../../utils/formatCurrency";

export default function TransactionData({ item, price, bank, category, createdAt, type, onDelete, onEdit }) {
  const isIncome = String(type ?? category ?? "").toLowerCase() === "income";
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric" })
    : "";

  return (
    <div className="centerX justify-between p-4">
      <div className="centerX gap-3">
        <Icon icon={setCategoryIcon(category)} variant="primary" />
        <div>
          <p className="font-bold leading-none">{ formatString(item) }</p>
          <div className="centerX">
            <p className="text-xs text-muted">{ bank }</p>
            <Dot className="text-muted" />
            <p className="text-xs text-muted">{ formatString(category) }</p>
          </div>
        </div>
      </div>

      <div>
        <div className="centerX gap-2 justify-end">
          <p className={`font-bold text-right ${isIncome ? "text-success" : "text-primary"}`}>
            {isIncome ? "+" : "-"}{formatCurrency(price)}
          </p>
          {
            onEdit && (
              <button onClick={onEdit} className="text-muted" type="button">
                <Pencil size={16} />
              </button>
            )
          }
          {
            onDelete && (
              <button onClick={onDelete} className="text-danger" type="button">
                <Trash2 size={16} />
              </button>
            )
          }
        </div>
        <p className="text-xs text-muted text-right">{formattedDate}</p>
      </div>
    </div>
  )
}
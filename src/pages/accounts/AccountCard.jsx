/* eslint-disable react/prop-types */
import { formatString } from "../../utils/formatString";
import { setBankLogo } from "../../utils/setBankLogo";
import { formatCurrency } from "../../utils/formatCurrency";
import { Trash2 } from "lucide-react";

export default function AccountCard({ bankName, cardType, balance, onDelete, onSelect, isSelected = false }) {
  return (
    <button
      className={`w-full centerX justify-between p-4 border rounded-lg my-2 text-left ${isSelected ? "border-primary bg-surface" : ""}`}
      onClick={onSelect}
      type="button"
    >
      <div className="centerX gap-3">
        <div className="w-12 h-12 centerXY rounded-lg overflow-hidden">
          <img src={setBankLogo(bankName)} className="w-full h-full object-center" />
        </div>
        <div>
          <p className="text-lg font-bold leading-none">{ bankName }</p>
          <p className="text-muted">{ formatString(cardType) }</p>
        </div>
      </div>
      <div className="centerX gap-3">
        <p className="text-lg font-bold">{formatCurrency(balance)}</p>
        {
          onDelete && (
            <button
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              className="text-danger"
              type="button"
            >
              <Trash2 size={18} />
            </button>
          )
        }
      </div>
    </button>
  )
}
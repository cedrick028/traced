/* eslint-disable react/prop-types */
import { Ellipsis } from "lucide-react";
import { setBankLogo } from "../../../../utils/setBankLogo";
import { formatString } from "../../../../utils/formatString";
import { formatCurrency } from "../../../../utils/formatCurrency";

export default function BankCard({ bankName, cardType, balance, onMoreClick }) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="centerX justify-between">
        <div className="w-9 h-9 centerXY rounded-lg overflow-hidden">
          <img src={setBankLogo(bankName)} />
        </div>
        <button type="button" onClick={onMoreClick}>
          <Ellipsis />
        </button>
      </div>
      <div className="my-2">
        <p className="font-bold">{ bankName }</p>
      </div>
      <div>
        <p className="text-xs text-muted">{ formatString(cardType) }</p>
        <p className="text-base font-bold">{formatCurrency(balance)}</p>
      </div>
    </div>
  )
}
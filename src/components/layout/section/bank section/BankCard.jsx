/* eslint-disable react/prop-types */
import { Ellipsis } from "lucide-react";
import { setBankLogo } from "../../../../utils/setBankLogo";
import { formatString } from "../../../../utils/formatString";

export default function BankCard({ bankName, cardType }) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="centerX justify-between">
        <div className="w-9 h-9 centerXY rounded-lg overflow-hidden">
          <img src={setBankLogo(bankName)} />
        </div>
        <Ellipsis />
      </div>
      <div className="my-2">
        <p className="font-bold">{ bankName }</p>
      </div>
      <div>
        <p className="text-xs text-muted">{ formatString(cardType) }</p>
        <p className="text-base font-bold">₱43,570.00</p>
      </div>
    </div>
  )
}
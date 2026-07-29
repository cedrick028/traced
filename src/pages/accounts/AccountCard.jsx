/* eslint-disable react/prop-types */
import { formatString } from "../../utils/formatString";
import { setBankLogo } from "../../utils/setBankLogo";

export default function AccountCard({ bankName, cardType }) {
  return (
    <div className="centerX justify-between p-4 border rounded-lg my-2">
      <div className="centerX gap-3">
        <div className="w-12 h-12 centerXY rounded-lg overflow-hidden">
          <img src={setBankLogo(bankName)} className="w-full h-full object-center" />
        </div>
        <div>
          <p className="text-lg font-bold leading-none">{ bankName }</p>
          <p className="text-muted">{ formatString(cardType) }</p>
        </div>
      </div>
      <p className="text-lg font-bold">₱43,570.00</p>
    </div>
  )
}
import { Ellipsis } from "lucide-react";
import bpiLogo from "../../../../assets/bpi.png";
// import { gcashLogo } from "../../../../assets/gcash.jpg";
// import { ubLogo } from "../../../../assets/ub.jpg";

export default function BankCard() {
  return (
    <div className="p-2 border rounded-lg">
      <div className="centerX justify-between">
        <div className="w-9 h-9 centerXY rounded-lg overflow-hidden">
          <img src={bpiLogo} />
        </div>
        <Ellipsis />
      </div>
      <div className="my-2">
        <p className="font-bold">BPI</p>
      </div>
      <div>
        <p className="text-xs text-muted">Savings</p>
        <p className="text-base font-bold">₱43,570.00</p>
      </div>
    </div>
  )
}
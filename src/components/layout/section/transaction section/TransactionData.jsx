/* eslint-disable react/prop-types */
import { Dot } from "lucide-react";
import Icon from "../../../UI/icon/Icon";
import { setCategoryIcon } from "../../../../utils/setCategoryIcon";
import { formatString } from "../../../../utils/formatString";

export default function TransactionData({ item, price, bank, category }) {
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
        <p className="font-bold text-right">₱{price}</p>
        <p className="text-xs text-muted text-right">Jul 24</p>
      </div>
    </div>
  )
}
import { Dot, ShoppingCart } from "lucide-react";
import Icon from "../../../UI/icon/Icon";

export default function TransactionData() {
  return (
    <div className="centerX justify-between p-4">
      <div className="centerX gap-3">
        <Icon icon={ShoppingCart} variant="primary" />
        <div>
          <p className="font-bold leading-none">Grocery re-stock</p>
          <div className="centerX">
            <p className="text-xs text-muted">BPI</p>
            <Dot className="text-muted" />
            <p className="text-xs text-muted">Groceries</p>
          </div>
        </div>
      </div>

      <div>
        <p className="font-bold leading-none">₱5,125.75</p>
        <p className="text-xs text-muted text-right">Jul 24</p>
      </div>
    </div>
  )
}
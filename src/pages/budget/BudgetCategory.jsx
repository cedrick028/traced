/* eslint-disable react/prop-types */
import Icon from "../../components/UI/icon/Icon";
import ProgressBar from "../../components/UI/progress bar/ProgressBar";
import { formatString } from "../../utils/formatString";
import { setCategoryIcon } from "../../utils/setCategoryIcon";
import { formatCurrency } from "../../utils/formatCurrency";

export default function BudgetCategory({ category, spent, percentage, isHighSpending }) {
  return (
    <div className="centerX gap-4 p-4 border rounded-xl">
      <Icon icon={setCategoryIcon(category)} variant="primary" />
      <div className="flex-1">
        <div className="flex justify-between">
          <p className="font-bold">{ formatString(category) }</p>
          <p className="font-bold">{formatCurrency(spent)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-xs text-muted">
            {isHighSpending ? "High spending category" : "Within normal range"}
          </p>
          <p className={`text-xs ${isHighSpending ? "text-danger" : "text-muted"}`}>
            {Math.round(percentage)}%
          </p>
        </div>
        <ProgressBar variant="light" value={percentage} />
      </div>
    </div>
  )
}
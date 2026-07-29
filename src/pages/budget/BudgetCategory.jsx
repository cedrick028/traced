/* eslint-disable react/prop-types */
import Icon from "../../components/UI/icon/Icon";
import ProgressBar from "../../components/UI/progress bar/ProgressBar";
import { formatString } from "../../utils/formatString";
import { setCategoryIcon } from "../../utils/setCategoryIcon";

export default function BudgetCategory({ category }) {
  return (
    <div className="centerX gap-4 p-4 border rounded-xl">
      <Icon icon={setCategoryIcon(category)} variant="primary" />
      <div className="flex-1">
        <div className="flex justify-between">
          <p className="font-bold">{ formatString(category) }</p>
          <p className="font-bold">₱3,200.00</p>
        </div>
        <div className="flex justify-between">
          <p className="text-xs text-muted">₱2,400.00 spent</p>
          <p className="text-xs text-muted">62%</p>
        </div>
        <ProgressBar variant="light" />
      </div>
    </div>
  )
}
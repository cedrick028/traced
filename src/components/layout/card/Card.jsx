import { Ellipsis, Eye, Plus, User } from "lucide-react";
import Icon from "../../UI/icon/Icon";
import useAuth from "../../../hooks/useAuth";
import BudgetSummary from "./BudgetSummary";

export default function Card() {
  const { displayName } = useAuth();
  return (
    <div>
      <div className="w-full rounded-t-xl bg-primary p-4 mt-4 overflow-hidden">
        <div className="centerX justify-between">
          <div className="centerX gap-3">
            <Icon icon={User} variant="light" />
            <p className="text-base font-bold text-white tracking-wide">{displayName}&apos;s Account</p>
          </div>
          <Ellipsis color="white" />
        </div>
        <div className="mt-6">
          <p className="text-xs text-white">Available balance</p>
          <div className="centerX gap-3 mt-2">
            <p className="text-4xl text-white">₱86,355.00</p>
            <div className="w-6 h-6 centerXY">
              <Eye size={18} color="white" />
            </div>
          </div>
          <div className="w-full flex justify-end mt-6">
            <button className="h-7 centerX gap-1 text-xs text-white px-3 border border-white rounded-md">
              <Plus size={16} color="white" />
              Add money
            </button>
          </div>
        </div>
      </div>

      <BudgetSummary />
    </div>
    
  )
}
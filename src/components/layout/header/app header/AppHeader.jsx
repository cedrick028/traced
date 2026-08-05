/* eslint-disable react/prop-types */
import { Menu, User } from "lucide-react";
import { useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import useBank from "../../../../hooks/useBank";
import useTransaction from "../../../../hooks/useTransaction";
import { formatCurrency } from "../../../../utils/formatCurrency";
import Logo from "../../logo/Logo";

export default function AppHeader({ openNav }) {
  const { displayName } = useAuth();
  const { bankList, totalBalance } = useBank();
  const { transactionList } = useTransaction();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <div className="centerX justify-between px-4 py-2 border-b relative">
        <Menu onClick={openNav} />
        <Logo />
        <button type="button" onClick={() => setIsProfileOpen((value) => !value)}>
          <User />
        </button>

        {
          isProfileOpen && (
            <div className="absolute right-4 top-12 z-50 w-64 p-4 border rounded-xl bg-white shadow-lg">
              <div className="centerX gap-3">
                <div className="w-10 h-10 rounded-full bg-surface centerXY">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-bold">{displayName}</p>
                  <p className="text-xs text-muted">Account summary</p>
                </div>
              </div>

              <div className="mt-3 border rounded-lg p-3">
                <div className="centerX justify-between">
                  <p className="text-muted text-xs">Bank accounts</p>
                  <p className="font-medium">{bankList.length}</p>
                </div>
                <div className="centerX justify-between mt-2">
                  <p className="text-muted text-xs">Transactions</p>
                  <p className="font-medium">{transactionList.length}</p>
                </div>
                <div className="centerX justify-between mt-2">
                  <p className="text-muted text-xs">Balance summary</p>
                  <p className="font-medium">{formatCurrency(totalBalance)}</p>
                </div>
              </div>
            </div>
          )
        }
      </div>

      {
        isProfileOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40"
            onClick={() => setIsProfileOpen(false)}
            aria-label="Close profile summary"
          ></button>
        )
      }
    </>
  )
}
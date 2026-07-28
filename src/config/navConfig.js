import { ArrowLeftRight, ChartColumnBig, CreditCard, Grip, WalletCards } from "lucide-react";

export const navConfig = [
  { id: 1, label: "Dashboard", icon: Grip, to: "/dashboard" },
  { id: 2, label: "Transactions", icon: ArrowLeftRight, to: "/transactions" },
  { id: 3, label: "Accounts", icon: WalletCards, to: "/accounts" },
  { id: 4, label: "Budget", icon: CreditCard, to: "/budget" },
  { id: 5, label: "Reports", icon: ChartColumnBig, to: "/reports" }
]
import { useContext } from "react";
import { BudgetContext } from "../context/BudgetContext";

export default function useBudget() {
  return useContext(BudgetContext);
}

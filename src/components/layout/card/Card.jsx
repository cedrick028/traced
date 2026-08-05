import { Ellipsis, Eye, Plus, User, X } from "lucide-react";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Icon from "../../UI/icon/Icon";
import useAuth from "../../../hooks/useAuth";
import BudgetSummary from "./BudgetSummary";
import useBank from "../../../hooks/useBank";
import useTransaction from "../../../hooks/useTransaction";
import { getTotalBalance } from "../../../utils/bankBalance";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function Card() {
  const { displayName } = useAuth();
  const { bankList } = useBank();
  const { addIncomeTransaction, transactionList } = useTransaction();

  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [amount, setAmount] = useState("");
  const [selectedBankId, setSelectedBankId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const totalBalance = getTotalBalance(bankList, transactionList);

  const handleOpenAddMoney = () => {
    setIsAddMoneyOpen(true);
    setFormError("");
    setSubmitError("");

    if (!selectedBankId && bankList[0]?.id) {
      setSelectedBankId(String(bankList[0].id));
    }
  }

  const handleAddMoney = async () => {
    const numericAmount = Number(amount);

    if (isSubmitting) return;

    if (!selectedBankId) {
      setFormError("Please select an account.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setFormError("Please enter an amount greater than 0.");
      return;
    }

    const selectedBank = bankList.find((bank) => String(bank.id) === selectedBankId);
    if (!selectedBank) {
      setFormError("Selected account was not found.");
      return;
    }

    setFormError("");
    setSubmitError("");

    setIsSubmitting(true);

    const { error: incomeError } = await addIncomeTransaction({
      amount: numericAmount,
      bank: selectedBank.bank_name,
      bankId: selectedBank.id
    });

    if (!incomeError) {
      setAmount("");
      setIsAddMoneyOpen(false);
      setShowAccountPicker(false);
      setSubmitError("");
    } else {
      console.log(incomeError);
      setSubmitError("Unable to add money right now. Please try again.");
    }

    setIsSubmitting(false);
  }

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
            <p className="text-4xl text-white">{isBalanceVisible ? formatCurrency(totalBalance) : "••••••"}</p>
            <button className="w-6 h-6 centerXY" type="button" onClick={() => setIsBalanceVisible((value) => !value)}>
              <Eye size={18} color="white" />
            </button>
          </div>
          <div className="w-full flex justify-end mt-6">
            <button className="h-7 centerX gap-1 text-xs text-white px-3 border border-white rounded-md" onClick={handleOpenAddMoney}>
              <Plus size={16} color="white" />
              Add money
            </button>
          </div>
        </div>
      </div>

      {
        isAddMoneyOpen && (
          <div className="fixed inset-0 z-40 bg-primary/35 backdrop-blur-sm p-4 centerXY">
            <div className="w-full max-w-md bg-white rounded-xl border p-4">
              <div className="centerX justify-between">
                <p className="font-bold">Add money</p>
                <button onClick={() => setIsAddMoneyOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4">
                <p className="text-xs text-muted">Amount</p>
                <input
                  type="number"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value);
                    if (formError) setFormError("");
                    if (submitError) setSubmitError("");
                  }}
                  placeholder="0"
                  className="w-full h-11 px-3 border rounded-lg mt-1 focus:outline-none"
                />
              </div>

              {
                showAccountPicker && bankList.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-muted">Select account</p>
                    <select
                      className="w-full h-11 px-3 border rounded-lg mt-1"
                      value={selectedBankId}
                      onChange={(event) => {
                        setSelectedBankId(event.target.value);
                        if (formError) setFormError("");
                        if (submitError) setSubmitError("");
                      }}
                    >
                      {
                        bankList.map((bank) => (
                          <option key={bank.id} value={bank.id}>{bank.bank_name}</option>
                        ))
                      }
                    </select>
                  </div>
                )
              }

              {
                bankList.length === 0 && (
                  <p className="text-xs text-danger mt-3">Add an account first before adding balance.</p>
                )
              }

              {
                formError && <p className="text-danger text-xs mt-2">{formError}</p>
              }

              {
                submitError && <p className="text-danger text-xs mt-2">{submitError}</p>
              }

              <button
                className="w-full h-11 border rounded-lg mt-3"
                onClick={() => setShowAccountPicker((value) => !value)}
                disabled={bankList.length === 0}
              >
                {showAccountPicker ? "Hide accounts" : "Choose account"}
              </button>

              <button
                className="w-full h-11 rounded-lg text-white bg-primary mt-2 disabled:opacity-60"
                onClick={handleAddMoney}
                disabled={isSubmitting || bankList.length === 0}
              >
                {
                  isSubmitting ? (
                    <span className="centerXY">
                      <CircularProgress size={18} sx={{ color: "#FFFFFF" }} />
                    </span>
                  ) : (
                    "Add"
                  )
                }
              </button>
            </div>
          </div>
        )
      }

      <BudgetSummary />
    </div>
    
  )
}
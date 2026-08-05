import { Plus, X } from "lucide-react";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "../../components/layout/card/Card";
import BankSection from "../../components/layout/section/bank section/BankSection";
import SpentSection from "../../components/layout/section/spent section/SpentSection";
import TransactionSection from "../../components/layout/section/transaction section/TransactionSection";
import useBank from "../../hooks/useBank";
import useTransaction from "../../hooks/useTransaction";

export default function Dashboard() {
  const { bankList, adjustBankBalance } = useBank();
  const { addExpenseTransaction } = useTransaction();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValue, setFormValue] = useState({
    item: "",
    quantity: "1",
    pricePerPiece: ""
  });

  const openCreateModal = () => {
    setIsCreateOpen(true);

    if (!selectedBankId && bankList[0]?.id) {
      setSelectedBankId(String(bankList[0].id));
    }
  }

  const handleCreateTransaction = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const selectedBank = bankList.find((bank) => String(bank.id) === String(selectedBankId));

    if (!selectedBank) return;

    const totalExpense = Number(formValue.quantity) * Number(formValue.pricePerPiece);

    setIsSubmitting(true);

    const { error: transactionError } = await addExpenseTransaction({
      item: formValue.item,
      quantity: formValue.quantity,
      pricePerPiece: formValue.pricePerPiece,
      bank: selectedBank.bank_name,
      bankId: selectedBank.id
    });

    if (!transactionError) {
      await adjustBankBalance(selectedBank.id, -Math.max(0, totalExpense));
      setFormValue({ item: "", quantity: "1", pricePerPiece: "" });
      setIsCreateOpen(false);
    }

    setIsSubmitting(false);
  }

  return (
    <>
      <div className="page-shell page-stack page-shell-fab">
        <p className="text-lg font-bold tracking-wide">Dashboard</p>

        <Card />
        <SpentSection />
        <BankSection />
        <TransactionSection />
      </div>

      <button
        className="fixed bottom-6 right-4 w-14 h-14 rounded-full bg-primary text-white centerXY shadow-lg"
        onClick={openCreateModal}
      >
        <Plus size={24} />
      </button>

      {
        isCreateOpen && (
          <div className="fixed inset-0 z-50 bg-primary/35 backdrop-blur-sm p-4 centerXY">
            <form className="w-full max-w-md p-4 bg-white border rounded-xl" onSubmit={handleCreateTransaction}>
              <div className="centerX justify-between">
                <p className="font-bold">Add expense transaction</p>
                <button type="button" onClick={() => setIsCreateOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <input
                className="w-full h-11 px-3 border rounded-lg mt-4"
                placeholder="Item name"
                value={formValue.item}
                onChange={(event) => setFormValue((value) => ({ ...value, item: event.target.value }))}
                required
              />

              <input
                className="w-full h-11 px-3 border rounded-lg mt-2"
                placeholder="Quantity"
                type="number"
                min="1"
                value={formValue.quantity}
                onChange={(event) => setFormValue((value) => ({ ...value, quantity: event.target.value }))}
                required
              />

              <input
                className="w-full h-11 px-3 border rounded-lg mt-2"
                placeholder="Price per piece"
                type="number"
                min="0"
                step="0.01"
                value={formValue.pricePerPiece}
                onChange={(event) => setFormValue((value) => ({ ...value, pricePerPiece: event.target.value }))}
                required
              />

              {
                bankList.length > 0 ? (
                  <select
                    className="w-full h-11 px-3 border rounded-lg mt-2"
                    value={selectedBankId}
                    onChange={(event) => setSelectedBankId(event.target.value)}
                    required
                  >
                    {
                      bankList.map((bank) => (
                        <option key={bank.id} value={bank.id}>{bank.bank_name}</option>
                      ))
                    }
                  </select>
                ) : (
                  <p className="text-xs text-danger mt-3">Add an account first before creating a transaction.</p>
                )
              }

              <button
                className="w-full h-11 rounded-lg text-white bg-primary mt-3 disabled:opacity-60"
                type="submit"
                disabled={isSubmitting || bankList.length === 0}
              >
                {
                  isSubmitting ? (
                    <span className="centerXY">
                      <CircularProgress size={18} sx={{ color: "#FFFFFF" }} />
                    </span>
                  ) : (
                    "Add transaction"
                  )
                }
              </button>
            </form>
          </div>
        )
      }
    </>
  )
}
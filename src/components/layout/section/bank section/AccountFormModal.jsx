/* eslint-disable react/prop-types */
import { X } from "lucide-react";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import useBank from "../../../../hooks/useBank";

const initialFormValue = {
  bankCategory: "",
  bankType: "",
  balance: ""
};

const BANK_OPTIONS = [
  "BPI",
  "BDO",
  "GCash",
  "Maribank",
  "Metrobank",
  "Maya",
  "UnionBank",
  "Wise"
];

export default function AccountFormModal({ isOpen, onClose, onCreated }) {
  const { addBank } = useBank();
  const [formValue, setFormValue] = useState(initialFormValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const { data, error } = await addBank({
      bankName: formValue.bankCategory,
      cardType: formValue.bankType,
      balance: formValue.balance
    });

    if (!error) {
      setFormValue(initialFormValue);
      onClose();
      onCreated?.(data);
    }

    setIsSubmitting(false);
  }

  return (
    <div className="fixed inset-0 z-50 bg-primary/35 backdrop-blur-sm p-4 centerXY">
      <form className="w-full max-w-md bg-white border rounded-xl p-4" onSubmit={handleSubmit}>
        <div className="centerX justify-between">
          <p className="font-bold">Add account</p>
          <button type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <select
          className="w-full h-11 px-3 border rounded-lg mt-4"
          value={formValue.bankCategory}
          onChange={(event) => setFormValue((value) => ({ ...value, bankCategory: event.target.value }))}
          required
        >
          <option value="" disabled>Select bank</option>
          {
            BANK_OPTIONS.map((bankOption) => (
              <option key={bankOption} value={bankOption}>{bankOption}</option>
            ))
          }
        </select>

        <input
          className="w-full h-11 px-3 border rounded-lg mt-2"
          placeholder="Bank type"
          value={formValue.bankType}
          onChange={(event) => setFormValue((value) => ({ ...value, bankType: event.target.value }))}
          required
        />

        <input
          className="w-full h-11 px-3 border rounded-lg mt-2"
          placeholder="Balance"
          type="number"
          min="0"
          value={formValue.balance}
          onChange={(event) => setFormValue((value) => ({ ...value, balance: event.target.value }))}
          required
        />

        <button
          type="submit"
          className="w-full h-11 text-white bg-primary rounded-lg mt-3 disabled:opacity-60"
          disabled={isSubmitting}
        >
          {
            isSubmitting ? (
              <span className="centerXY">
                <CircularProgress size={18} sx={{ color: "#FFFFFF" }} />
              </span>
            ) : (
              "Add account"
            )
          }
        </button>
      </form>
    </div>
  );
}

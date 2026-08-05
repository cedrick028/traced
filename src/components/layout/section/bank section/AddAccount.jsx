import { Plus } from "lucide-react";
import { useState } from "react";
import Icon from "../../../UI/icon/Icon";
import AccountFormModal from "./AccountFormModal";

export default function AddAccount() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        className="h-[147px] centerXY flex-col gap-2 p-2 border border-dashed rounded-lg"
        onClick={() => setIsModalOpen(true)}
        type="button"
      >
        <Icon icon={Plus} variant="primary" />
        <p className="text-xs text-muted">Add account</p>
      </button>

      <AccountFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
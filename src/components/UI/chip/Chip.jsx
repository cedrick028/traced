import { formatString } from "../../../utils/formatString";

/* eslint-disable react/prop-types */
export default function Chip({ label, onClick, isActive = false }) {
  return (
    <button
      className={`w-fit h-9 centerX px-5 border rounded-lg ${isActive ? "bg-primary text-white" : "bg-white"}`}
      onClick={onClick}
      type="button"
    >
      <p className="text-[13px]">{ formatString(label) }</p>
    </button>
  )
}
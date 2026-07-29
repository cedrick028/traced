import { formatString } from "../../../utils/formatString";

/* eslint-disable react/prop-types */
export default function Chip({ label, onClick }) {
  return (
    <div className="w-fit h-9 centerX px-5 border rounded-lg" onClick={onClick}>
      <p className="text-[13px]">{ formatString(label) }</p>
    </div>
  )
}
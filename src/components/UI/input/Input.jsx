import { formatString } from "../../../utils/formatString";

/* eslint-disable react/prop-types */
export default function Input({ label, type, placeholder, value, onChange, className, iconL: IconL }) {
  return (
    <div className={`w-full ${className}`}>
      <p className="font-medium leading-none">{ formatString(label) ?? "" }</p>
      <div className="h-12 centerX gap-2 px-3 border rounded-lg mt-2">
        <IconL size={20} />
        <input type={type} placeholder={formatString(placeholder)} value={value} onChange={onChange} className="w-full focus:outline-none -mt-0.5" />
      </div>
    </div>
  )
}
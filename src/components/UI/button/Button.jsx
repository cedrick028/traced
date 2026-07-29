import { formatString } from "../../../utils/formatString"

/* eslint-disable react/prop-types */
export default function Button({ label, icon: Icon, variant, onClick, className, disabled = false }) {
  const buttonStyle = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary",
    transparent: "bg-white border border-primary"
  }
  return (
    <button
      className={`w-full h-12 centerXY gap-1 border rounded-lg tracking-wide ${buttonStyle[variant?.toLowerCase()]} ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >

      { 
        Icon && (
          <Icon size={16} />
        )
      }
      
      <span className="text-[13px] mt-0.5">{ formatString(label) ?? "Click" }</span>
    </button>
  )
}
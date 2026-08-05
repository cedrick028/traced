import { formatString } from "../../../utils/formatString"
import CircularProgress from "@mui/material/CircularProgress";

/* eslint-disable react/prop-types */
export default function Button({ label, icon: Icon, variant, onClick, className, disabled = false, loading = false }) {
  const buttonStyle = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary",
    transparent: "bg-white border border-primary"
  }

  const isDisabled = disabled || loading;
  const spinnerColor = variant?.toLowerCase() === "primary" ? "#FFFFFF" : "#141618";

  return (
    <button
      className={`w-full h-12 centerXY gap-2 border rounded-lg tracking-wide ${buttonStyle[variant?.toLowerCase()]} ${isDisabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
      onClick={onClick}
      disabled={isDisabled}
    >

      {
        loading ? (
          <CircularProgress size={16} sx={{ color: spinnerColor }} />
        ) : (
          Icon && (
            <Icon size={16} />
          )
        )
      }
      
      <span className="text-[13px] mt-0.5">{ formatString(label) ?? "Click" }</span>
    </button>
  )
}